from .model import Document


def create_documents(doc_ids, doc_names, texts, num_chunks, db):
    documents = []
    for id, name, t, c in zip(doc_ids, doc_names, texts, num_chunks):
        documents.append(
            Document(
                name=name,
                external_id=id,
                number_chunks=c,
                length=len(t),
                content=t,
            )
        )
    db.add_all(documents)
    db.commit()


def delete_documents(document_ids, db):
    docs = db.query(Document).filter(Document.external_id.in_(document_ids)).all()
    for d in docs:
        db.delete(d)
    db.commit()


def get_documents(db):
    return db.query(Document).all()
