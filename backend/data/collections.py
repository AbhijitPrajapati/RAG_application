from .sqlalchemy_setup import Collection
from sqlalchemy.exc import IntegrityError
from errors import DuplicateCollectionError

def collections(sql_db):
    return sql_db.query(Collection).all()

def delete_collections(chroma_db, sql_db, collection_ids):
    chunks = chroma_db.get(where={'collection_id': 
                                    {'$in': collection_ids}
                                    })
    chunk_ids = chunks['ids']
    if chunk_ids:
        chroma_db.delete(ids=chunk_ids)
    
    sql_db.query(Collection).filter(Collection.id.in_(collection_ids)).delete()
    sql_db.commit()

def create_collection(name, sql_db):
    collection = Collection(name=name)
    try:
        sql_db.add(collection)
        sql_db.commit()
        sql_db.refresh(collection)
        return collection.id
    except IntegrityError:
        sql_db.rollback()
        raise DuplicateCollectionError(name)

