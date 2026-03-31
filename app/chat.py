def chat(
    n_chunks=30,
    top_n=7,
    temperature=0.7,
    max_tokens=None,
    top_p=0.95,
    top_k=40,
):
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant. Respond to the user's prompt using ONLY the context given and NO external knowlege. You may utilize previous messages from either the user or yourself.",
        },
    ]

    while True:
        prompt = input("\nUser: ")
        if prompt == "/e":
            break

        from models import call_llm
        from services import query_documents

        chunks = query_documents(prompt, n_chunks, top_n)
        assert chunks is not None
        context = "\n".join([c for c in chunks])
        messages.append(
            {
                "role": "user",
                "content": f"""
        Context:
        {context}

        Prompt:
        {prompt}
        """,
            }
        )
        print("\nAssistant: ")
        response = ""

        for token in call_llm(messages, temperature, max_tokens, top_p, top_k):
            assert token is not None
            print(token, end="", flush=True)
            response += token
        print("\n")
        messages.append({"role": "assistant", "content": response})
