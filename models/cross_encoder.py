from sentence_transformers import CrossEncoder

reranker = None


def rerank(query, chunks, top_n):
    global reranker
    pairs = [(query, chunk) for chunk in chunks]
    if reranker is None:
        reranker = CrossEncoder("BAAI/bge-reranker-base", backend="torch")
    scores = reranker.predict(pairs)
    top_idx = scores.argsort()[-top_n:]
    top_chunks = [chunks[i] for i in top_idx]
    return top_chunks[::-1]
