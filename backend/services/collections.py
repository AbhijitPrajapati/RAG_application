from data.sql.sqlalchemy_setup import Collection

def get(sql_db):
    return sql_db.query(Collection).all()

def delete(chroma_db, sql_db, collection_ids):
    chunks = chroma_db.get(where={'collection_id': 
                                    {'$in': collection_ids}
                                    })
    chunk_ids = chunks['ids']
    if chunk_ids:
        chroma_db.delete(ids=chunk_ids)
    
    collections = sql_db.query(Collection).filter(Collection.id.in_(collection_ids)).all()
    for c in collections: 
        sql_db.delete(c)
    sql_db.commit()

def create(name, sql_db):
    collection = Collection(name=name)
    sql_db.add(collection)
    sql_db.commit()
    sql_db.refresh(collection)
    return collection.id, collection.created_at

def rename(collection_id, name, sql_db):
    c = sql_db.query(Collection).filter(Collection.id == collection_id).first()
    c.name = name
    sql_db.commit()