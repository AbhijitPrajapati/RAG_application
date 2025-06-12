export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export type Config = {
    n_chunks: number,
    max_tokens: number,
    temperature: number
};

