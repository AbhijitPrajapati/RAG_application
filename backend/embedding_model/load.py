from sentence_transformers import SentenceTransformer

MODEL_NAME = 'BAAI/bge-small-en-v1.5'

def load_embedding_model():
    embedding_model = SentenceTransformer(MODEL_NAME)
    return embedding_model

