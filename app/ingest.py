import services
import os


def ingest_documents(doc_or_folder_paths):
    texts = []
    doc_names = []
    for fp in doc_or_folder_paths:
        if not os.path.isdir(fp):
            with open(fp, "r", errors="ignore") as f:
                texts.append(f.read())
                doc_names.append(fp)
            continue
        for inner_file in os.listdir(fp):
            inner_fp = os.path.join(fp, inner_file)
            if not os.path.isfile(inner_fp):
                continue
            with open(inner_fp, "r", errors="ignore") as f:
                texts.append(f.read())
                doc_names.append(inner_file)
    services.add_documents(doc_names, texts)
    print(
        f"Added {f'{len(doc_names)} documents' if len(doc_names) > 1 else doc_names[0]}"
    )
