from textual.app import App, ComposeResult
from textual.screen import ModalScreen
from textual.widgets import DataTable, Button, Static
from textual.containers import Horizontal, Vertical
from textual import events
import services


class ConfirmDeleteScreen(ModalScreen[bool]):
    def __init__(self, count: int) -> None:
        super().__init__()
        self.count = count

    def compose(self) -> ComposeResult:
        yield Vertical(
            Static(
                f"Confirm deletion of {self.count} document{'s' if self.count != 1 else ''}?",
                id="confirm_message",
            ),
            Horizontal(
                Button("Yes", id="confirm_yes", variant="error"),
                Button("No", id="confirm_no", variant="primary"),
                id="confirm_buttons",
            ),
            id="confirm_container",
        )

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "confirm_yes":
            self.dismiss(True)
        else:
            self.dismiss(False)

    async def on_key(self, event: events.Key) -> None:
        key = event.key.lower()
        if key == "y":
            self.dismiss(True)
        elif key == "n" or event.key == "escape":
            self.dismiss(False)


class DocumentTable(App):
    def compose(self) -> ComposeResult:
        table = DataTable()
        table.cursor_type = "row"
        yield table

    def on_mount(self) -> None:
        table = self.query_one(DataTable)

        table.add_columns(
            "Name", "Created At", "Length", "Number Chunks", ("Delete", "del_key")
        )

        self.selected_external_ids = set()
        self.selected_row_keys = set()
        self.document_ids = []
        docs = services.list_documents()
        for d in docs:
            self.document_ids.append(d.external_id)
            table.add_row(
                d.name,
                d.uploaded_at,
                d.length,
                d.number_chunks,
                "     ",
            )

        table.focus()

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        table: DataTable = self.query_one(DataTable)
        row_key = event.row_key
        row_index = table.get_row_index(row_key)
        document_id = self.document_ids[row_index]
        if document_id in self.selected_external_ids:
            self.selected_external_ids.remove(document_id)
            self.selected_row_keys.remove(row_key)
            table.update_cell(row_key, "del_key", "     ")
        else:
            self.selected_external_ids.add(document_id)
            self.selected_row_keys.add(row_key)
            table.update_cell(row_key, "del_key", "[red][ x ][/]")

    async def on_key(self, event: events.Key):
        if event.key == "q":
            await self.action_quit()
        if event.key == "d":
            if not self.selected_external_ids:
                self.notify("[yellow]No documents have been selected[/]")
                return

            def on_confirm_delete(result: bool | None) -> None:
                if not result:
                    return

                services.delete_documents(list(self.selected_external_ids))

                table = self.query_one(DataTable)
                for rk in self.selected_row_keys:
                    table.remove_row(rk)

                self.notify(
                    f"[green]Deleted {len(self.selected_external_ids)} document{'s' if len(self.selected_external_ids) != 1 else ''}.[/]"
                )
                self.selected_external_ids.clear()
                self.selected_row_keys.clear()

            confirm = ConfirmDeleteScreen(len(self.selected_external_ids))
            self.push_screen(confirm, on_confirm_delete)


def manage_documents():
    DocumentTable().run()
