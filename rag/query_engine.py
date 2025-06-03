def build_prompt(chunks, metadata, query):
    context = '\n'.join([f'[Source: {metadata[i]["source"]}]\n{chunks[i]}' for i in range(len(chunks))])

    out = f'''
    <s>[INST] 
    You are a knowlegable assistant. Respond to the user's prompt using only the context given and no external knowlege. You are given the name of the file that each excerpt came from in square brackets before said excerpt. At the end of your response, cite which files you used.
    Context:
    {context}
    User's Prompt:
    {query}
    Your Response: 
    '''

    return out

def query(query, model, collection, max_tokens=512, n_results=3):
    assert collection.count() != 0

    result = collection.query(query_texts=[query.strip()], n_results=n_results)

    prompt = build_prompt(result['documents'][0], result['metadatas'][0], query.strip())

    yield from model(prompt, max_new_tokens = max_tokens, temperature=0.8)
