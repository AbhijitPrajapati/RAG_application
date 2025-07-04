from sentence_transformers.cross_encoder import CrossEncoder

def load_reranker():
    return CrossEncoder('backend/models/resources/bge-reranker-base', device='cuda')

