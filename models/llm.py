from llama_cpp import Llama
import json

model = None


def call_llm(messages, temperature, max_tokens, top_p, top_k):
    global model
    if model is None:
        with open("gpu_model_config.json", "r") as f:
            config = json.load(f)
        try:
            model = Llama(
                **config,
                n_ctx=0,
                verbose=False,
            )
        except ValueError:
            raise ValueError(
                f"Model loading unsuccessful. One or more of the following loading parameters are likely incompatible with the hardware and/or the model.\n{config}"
            )
    res = model.create_chat_completion(
        messages,
        temperature=temperature,
        max_tokens=max_tokens,
        top_k=top_k,
        top_p=top_p,
        stream=True,
    )  # type: ignore
    for chunk in res:
        delta = chunk["choices"][0]["delta"]  # type: ignore
        if "content" in delta:
            yield delta["content"]  # type: ignore
