from sentence_transformers import SentenceTransformer
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings

embedding_model = None


def embed(strings):
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer("BAAI/bge-base-en-v1.5", backend="torch")
    return embedding_model.encode(strings)


def shifted_similarity(strings):
    embeddings = embed(strings)
    assert embedding_model is not None
    return embedding_model.similarity_pairwise(embeddings[:-1], embeddings[1:])


class EmbeddingFn(EmbeddingFunction[Documents]):
    def __call__(self, input: Documents) -> Embeddings:
        return embed(input)
