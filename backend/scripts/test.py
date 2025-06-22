from exllamav2 import ExLlamaV2, ExLlamaV2Config, ExLlamaV2Cache, ExLlamaV2Tokenizer
from exllamav2.generator import ExLlamaV2DynamicGenerator, ExLlamaV2StreamingGenerator
from exllamav2.generator.sampler import ExLlamaV2Sampler

model_dir = 'C:/Users/talka/code/RAG_application/model/mistral'
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

prompt = '''
<s>[INST] What is your favorite condiment? [/INST]
"Well, I'm quite partial to a good squeeze of fresh lemon juice. It adds just the right amount of zesty flavour to whatever I'm cooking up in the kitchen!"</s> [INST] The right amount of what? [/INST]
'''

# output = generator.generate(prompt = prompt, max_new_tokens = 512, encode_special_tokens=True, completion_only=True, stop_conditions=[2])
s = ExLlamaV2Sampler.Settings()
generator.begin_stream_ex(tokenizer.encode(prompt), s)