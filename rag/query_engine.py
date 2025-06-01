def build_prompt(chunks, metadata, query):
    context = '\n'.join([f'[Source: {metadata[i]["source"]}]\n{chunks[i]}' for i in range(len(chunks))])

    out = f'''
    You are a knowlegable assistant. Respond to the user's prompt using only the context given and no external knowlege. Cite your sources as well.

    Context:
    {context}

    Prompt: {query}

    Response: 
    '''

    return out

def query(query, model, collection, max_tokens=256, n_results=3):
    assert collection.count() != 0

    result = collection.query(query_texts=[query.strip()], n_results=n_results)

    prompt = build_prompt(result['documents'][0], result['metadatas'][0], query.strip())

    output = model(prompt, max_tokens=max_tokens)

    return output['choices'][0]['text']
