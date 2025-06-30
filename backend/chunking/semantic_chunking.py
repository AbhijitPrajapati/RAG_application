from nltk.tokenize import sent_tokenize
import torch

def cosine_similarity(vec1, vec2):
    return torch.dot(vec1, vec2) / (torch.norm(vec1) * torch.norm(vec2))

def chunk_document(text, embedding_model, similarity_threshold, sentence_overlap):
    sentences = sent_tokenize(text)
    embedded_sentences = embedding_model.encode(sentences, convert_to_numpy=False)

    similarities = [cosine_similarity(embedded_sentences[i], embedded_sentences[i + 1]) for i in range(len(embedded_sentences) - 1)]
        
    dip_idx = [i for i in range(len(similarities)) if similarities[i] < similarity_threshold]

    chunks = []
    current = [sentences[0]]
    for i, s in enumerate(sentences[1:]):
        if i in dip_idx:
            chunks.append(' '.join(current))
            ovr = min(sentence_overlap, len(current))
            current = current[-ovr:] + [sentences[i + 1]]
        else:
            current.append(s)
    if current:
        chunks.append(' '.join(current))
    return chunks