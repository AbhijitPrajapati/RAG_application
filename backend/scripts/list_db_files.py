from chromadb import PersistentClient

db = PersistentClient('backend/data/chroma_db')
collection = db.get_collection('documents')

m = collection.get(include=['metadatas'])['metadatas']
print(m)
# assert m != None
# sources = set([e['source'] for e in m])

# # print(sources)
# for meta in m:
#     print(meta['source'], meta['collection_id'])