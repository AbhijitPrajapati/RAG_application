
from chunking.semantic_chunking import chunk_document
from data.sql.sqlalchemy_setup import Collection, File

# seperate read_files when more file types come

ALLOWED_EXTENSIONS = {'.txt'}

async def read_files(files):
    names = []
    contents = []

    for f in files:
        filename = f.filename

        content_bytes = await f.read()
        text = content_bytes.decode().strip()
        
        names.append(filename)
        contents.append(text)
    
    return names, contents

def files(sql_db, collection_id):
    collection = sql_db.query(Collection).filter(Collection.id == collection_id).first()
    return collection.files

def add_documents(chroma_db, sql_db, embedding_model, texts, filenames, collection_id, chunk_similarity_threshold=0.55, chunk_overlap_sentences=1):
    chunks, metadata, return_files = [], [], []
    
    for text, filename in zip(texts, filenames):
        c = chunk_document(text, embedding_model, chunk_similarity_threshold, chunk_overlap_sentences)

        file = File(name=filename, collection_id=collection_id, number_chunks=len(c), length=len(text))
        sql_db.add(file)
        sql_db.flush()

        return_file = {
            'id': file.id,
            'name': filename,
            'length': file.length,
            'number_chunks': file.number_chunks,
            'uploaded_at': file.uploaded_at
        }
        return_files.append(return_file)

        chunks.extend(c)
        for chunk in c: 
            metadata.append({'file_id': file.id, 'collection_id': collection_id, 'length': len(chunk)})
    
    id_start = chroma_db.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    chroma_db.add(documents=chunks, ids=ids, metadatas=metadata)

    sql_db.commit()

    return return_files

def delete_documents(chroma_db, sql_db, file_ids):
    chunks = chroma_db.get(where={'file_id': 
                                    {'$in': file_ids}
                                    })
    chroma_db.delete(ids=chunks['ids'])

    files = sql_db.query(File).filter(File.id.in_(file_ids)).all()
    for f in files:
        sql_db.delete(f)
    sql_db.commit()

def get_document(chroma_db, file_id):
    chunks = chroma_db.get(where={'file_id': file_id}, include=['documents'])
    return ''.join(chunks['documents'])
    