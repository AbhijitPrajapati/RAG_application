from nltk.tokenize import sent_tokenize
from models import shifted_similarity
from storage.sql import create_documents
from storage.sql import get_db
from storage.chroma import add_chunks
from uuid import uuid4


def chunk_document(text, similarity_threshold, sentence_overlap):
    sentences = sent_tokenize(text)
    similarities = shifted_similarity(sentences)

    dip_idx = [
        i for i in range(len(similarities)) if similarities[i] < similarity_threshold
    ]

    chunks = []
    current = [sentences[0]]
    for i, s in enumerate(sentences[1:]):
        if i in dip_idx:
            chunks.append(" ".join(current))
            ovr = min(sentence_overlap, len(current))
            current = current[-ovr:] + [sentences[i + 1]]
        else:
            current.append(s)
    if current:
        chunks.append(" ".join(current))
    return chunks


def add_documents(doc_names, texts):
    num_chunks = []
    chunks = []
    doc_ids = []
    doc_ids_chunk_md = []
    for doc in texts:
        c = chunk_document(doc, 0.6, 1)
        num_chunks.append(len(c))
        chunks.extend(c)
        did = str(uuid4())
        doc_ids.append(did)
        doc_ids_chunk_md.extend([did] * len(c))
    with get_db() as db:
        create_documents(doc_ids, doc_names, texts, num_chunks, db)
    add_chunks(chunks, doc_ids_chunk_md)
