from chromadb import PersistentClient

db = PersistentClient('data/chroma_db')
collection = db.get_collection('documents')

m = collection.get(include=['metadatas'])['metadatas']

sources = set([e['source'] for e in m])

print(sources)