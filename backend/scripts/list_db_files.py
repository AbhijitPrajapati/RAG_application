from chromadb import PersistentClient
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

embedding_func = SentenceTransformerEmbeddingFunction(model_name='BAAI/bge-small-en-v1.5', device='cuda')

db = PersistentClient('backend/data/chroma_db')
db.delete_collection('documents')
db.create_collection('documents', embedding_function=embedding_func)
quit()
collection = db.get_collection('documents')

m = collection.get(include=['metadatas'])['metadatas']
print(m)
# assert m != None
# sources = set([e['source'] for e in m])

# # print(sources)
# for meta in m:
#     print(meta['source'], meta['collection_id'])