def build_prompt(chunks, sources, query):
    context = '\n'.join([f'[Source: {sources[i]}]\n{chunks[i]}' for i in range(len(chunks))])

    out = f'''
    <s>[INST] 
    You are an assistant. Respond to the user's prompt using ONLY the context given and NO external knowlege. You are given the name of the file that each excerpt came from in square brackets before said excerpt. At the end of your response, cite which files you used.
    Context:
    {context}
    User's Prompt:
    {query}
    Your Response: 
    '''

    return out

def query(query, model, db, collection_ids, max_tokens, n_results, temperature):
    assert db.count() != 0

    result = db.query(query_texts=[query.strip()], n_results=n_results, where={'collection_id': {'$in': collection_ids}})

    sources = [m['source'] for m in result['metadatas'][0]]
    prompt = build_prompt(result['documents'][0], sources, query.strip())

    yield from model(prompt, max_new_tokens=max_tokens, temperature=temperature)
