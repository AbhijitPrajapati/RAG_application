export interface Message  {
    role: 'user' | 'assistant';
    content: string;
};

export interface Collection {
    id: Number;
    name: string;
    created_at: string;
    last_modified: string;
    number_files: Number
}

