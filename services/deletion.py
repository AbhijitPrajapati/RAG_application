from storage.sql import (
    get_db,
    delete_documents as del_docs_sql,
)
from storage.chroma import delete_chunks


def delete_documents(doc_ids):
    with get_db() as db:
        del_docs_sql(doc_ids, db)
    delete_chunks(doc_ids)
