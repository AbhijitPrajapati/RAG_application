from chromadb import PersistentClient

db = PersistentClient('data/chroma_db')
collection = db.get_collection('documents')

m = collection.get(include=['metadatas'], where={'source': {'$in': ['sample_essay.txt', 'sample_essay_1.txt', 'sample_essay_2.txt']}})['metadatas']
print(m)
# assert m != None
# sources = set([e['source'] for e in m])

# # print(sources)
# for meta in m:
#     print(meta['source'], meta['collection_id'])