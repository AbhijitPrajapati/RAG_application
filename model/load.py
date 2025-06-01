from llama_cpp import Llama

def load_model(n_gpu_layers=35, n_ctx=4096):
    return Llama(model_path='model/mistral-7b-instruct-v0.1.Q4_K_M.gguf', n_gpu_layers=n_gpu_layers, n_ctx=n_ctx)
