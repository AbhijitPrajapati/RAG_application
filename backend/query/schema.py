from pydantic import BaseModel

class Query(BaseModel):
    query: str
    selected_collection_ids: list[int]
    n_chunks: int
    max_tokens: int
    temperature: float
    top_n_chunks: int