
from .chunking import chunk_document
from .sqlalchemy_setup import Collection, File
from datetime import datetime
from errors import EmptyFileError, InvalidFileFormatError

# seperate read_files when more file types come

ALLOWED_EXTENSIONS = {'.txt'}

async def read_files(files):
    names = []
    contents = []

    empty = []
    invalid_ext = []

    for f in files:
        filename = f.filename

        ext = filename[filename.rfind('.'):].lower()
        if ext not in ALLOWED_EXTENSIONS:
            invalid_ext.append(filename)
            continue

        content_bytes = await f.read()
        text = content_bytes.decode().strip()

        if not text:
            empty.append(filename)
            continue
        
        names.append(filename)
        contents.append(text)

    if invalid_ext:
        raise InvalidFileFormatError(invalid_ext)

    if empty:
        raise EmptyFileError(empty)
    
    return names, contents

def files(sql_db, collection_ids):
    collections = sql_db.query(Collection).filter(Collection.id.in_(collection_ids)).all()
    files = [file for c in collections for file in c.file]
    return files

def add_documents(chroma_db, sql_db, texts, filenames, collection_id, chunk_max_words=400, chunk_overlap_sentences=1):
    chunks, metadata = [], []
    
    for text, filename in zip(texts, filenames):
        c = chunk_document(text, chunk_max_words, chunk_overlap_sentences)

        file = File(name=filename, collection_id=collection_id, number_chunks=len(c), length=len(text))
        sql_db.add(file)
        sql_db.flush()

        chunks.extend(c)
        for chunk in c: 
            metadata.append({'file_id': file.id, 'collection_id': collection_id, 'length': len(chunk)})
    
    id_start = chroma_db.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    chroma_db.add(documents=chunks, ids=ids, metadatas=metadata)

    sql_db.commit()

