export interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export interface Collection {
	id: number;
	name: string;
	created_at: string;
	last_modified: string;
	number_files: number;
}

export interface Config {
	n_chunks: number;
	max_tokens: number;
	temperature: number;
}
