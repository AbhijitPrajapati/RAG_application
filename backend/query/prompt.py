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