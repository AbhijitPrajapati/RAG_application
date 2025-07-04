def rerank_chunks(query, chunks, reranking_model, top_n):
    pairs = [(query, chunk) for chunk in chunks]
    scores = reranking_model.predict(pairs)
    top_idx = scores.argsort()[-top_n:]
    top_chunks = [chunks[i] for i in top_idx]
    return top_chunks[::-1]