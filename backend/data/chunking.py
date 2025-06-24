from nltk.tokenize import sent_tokenize

def chunk_document(text, chunk_max_words, chunk_overlap_sentences):
    '''
    Splits document into chunks with maximum side and overlap
    '''
    chunks = []
    current = []
    word_count = 0
    
    sentences = sent_tokenize(text)

    for s in sentences:
        num_words = len(s.split())

        if word_count + num_words > chunk_max_words:
            chunks.append(' '.join(current))
            current = current[-chunk_overlap_sentences:]
            word_count = sum(len(se.split()) for se in current)
        current.append(s)
        word_count += num_words
    
    if len(current) > 0:
        chunks.append(' '.join(current))
    
    return chunks