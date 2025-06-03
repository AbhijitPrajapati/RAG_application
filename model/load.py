from exllamav2 import ExLlamaV2, ExLlamaV2Config, ExLlamaV2Cache, ExLlamaV2Tokenizer
from exllamav2.generator import ExLlamaV2DynamicGenerator, ExLlamaV2StreamingGenerator, ExLlamaV2Sampler

def load_model():
    model_dir = 'model/mistral'
    config = ExLlamaV2Config(model_dir)
    config.arch_compat_overrides()
    model = ExLlamaV2(config)
    cache = ExLlamaV2Cache(model, max_seq_len = 32768, lazy = True)
    model.load_autosplit(cache, progress = True)

    tokenizer = ExLlamaV2Tokenizer(config)

    generator = ExLlamaV2StreamingGenerator(
        model = model,
        cache = cache,
        tokenizer = tokenizer
    )
    generator.set_stop_conditions([tokenizer.eos_token_id])

    def generate(query, max_new_tokens, temperature):
        input_ids = tokenizer.encode(query, encode_special_tokens=True)
        gen_settings = ExLlamaV2Sampler.Settings(temperature=temperature)
        generator.begin_stream_ex(input_ids, gen_settings)
        for _ in range(max_new_tokens):
            out = generator.stream_ex()
            if out['eos']: break
            yield out['chunk']

    return generate


