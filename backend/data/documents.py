
from .chunking import chunk_document
from .sqlalchemy_setup import Collection
from datetime import datetime
from ..errors import EmptyFileError, InvalidFileFormatError

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

def files(chroma_db, collection_id):
    m = chroma_db.get(include=['metadatas'], where={'collection_id': collection_id})['metadatas']
    return set([e['source'] for e in m])

def add_documents(chroma_db, sql_db, texts, filenames, collection_id, chunk_max_words=400, chunk_overlap_sentences=1):
    chunks, metadata = [], []
    
    for text, filename in zip(texts, filenames):
        c, m = chunk_document(text, chunk_max_words, chunk_overlap_sentences)
        for meta in m: meta.update({'source': filename, 'collection_id': collection_id})
        chunks.extend(c)
        metadata.extend(m) 
    
    id_start = chroma_db.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    chroma_db.add(documents=chunks, ids=ids, metadatas=metadata)

    sql_db.query(Collection).filter(Collection.id == collection_id).update({
        Collection.number_files: Collection.number_files + len(texts),
        Collection.last_modified: datetime.now()
    })
    sql_db.commit()

