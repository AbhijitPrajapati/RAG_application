from .reranking import rerank_chunks
from .prompt import build_prompt

def query(query, generation_model, reranking_model, db, collection_ids, max_tokens, n_results, temperature, top_n):
    assert db.count() != 0 

    result = db.query(query_texts=[query.strip()], n_results=n_results, where={'collection_id': {'$in': collection_ids}})

    chunks = result['documents'][0]

    reranked_chunks = rerank_chunks(query, chunks, reranking_model, top_n)

    prompt = build_prompt(reranked_chunks, query.strip())

    yield from generation_model(prompt, max_new_tokens=max_tokens, temperature=temperature)