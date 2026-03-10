from .reranking import rerank_chunks
from .prompt import build_prompt
from ollama import chat


def query(
    query,
    reranking_model,
    db,
    collection_ids,
    max_tokens,
    n_results,
    temperature,
    top_n,
):
    assert db.count() != 0

    result = db.query(
        query_texts=[query.strip()],
        n_results=n_results,
        where={"collection_id": {"$in": collection_ids}},
    )

    chunks = result["documents"][0]

    reranked_chunks = rerank_chunks(query, chunks, reranking_model, top_n)

    messages = build_prompt(reranked_chunks, query.strip())

    response = chat(
        "mistral:7b-instruct-v0.2-q5_K_M",
        messages,
        stream=True,
        options={"num_predict": max_tokens, "temperature": temperature},
    )
    for chunk in response:
        content = chunk.message.content
        if content is not None:
            yield content
