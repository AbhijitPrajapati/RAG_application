from sentence_transformers import SentenceTransformer

def load_embedding_model():
    return SentenceTransformer('BAAI/bge-small-en-v1.5', device='cuda')

