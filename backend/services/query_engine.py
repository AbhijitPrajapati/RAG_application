def build_prompt(chunks, query):
    context = '\n'.join([chunk for chunk in chunks])

    out = f'''
    <s>[INST] 
    You are an assistant. Respond to the user's prompt using ONLY the context given and NO external knowlege.
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

    prompt = build_prompt(result['documents'][0], query.strip())

    yield from model(prompt, max_new_tokens=max_tokens, temperature=temperature)