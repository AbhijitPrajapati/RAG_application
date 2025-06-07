from nltk.tokenize import sent_tokenize

def chunk_documents(texts, filenames, collection, chunk_max_words, chunk_overlap_sentences):
    chunks = []
    metadata = []

    for text, filename in zip(texts, filenames):        
        current = []
        word_count = 0
        
        sentences = sent_tokenize(text)

        for s in sentences:
            num_words = len(s.split())

            if word_count + num_words > chunk_max_words:
                chunks.append(' '.join(current))
                
                metadata.append({
                    'source': filename,
                    'chunk_index': len(chunks) - 1,  
                    'length': sum(len(se) for se in current),
                    'collection': collection
                })

                current = current[-chunk_overlap_sentences:]
                word_count = sum(len(se.split()) for se in current)
            current.append(s)
            word_count += num_words
        
        if len(current) > 0:
            chunks.append(' '.join(current))
        
        metadata.append({
            'source': filename,
            'chunk_index': len(chunks) - 1,  
            'length': sum(len(se) for se in current),
        })
            
    return chunks, metadata