from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Request
from .schema import Query
from .service import query

query_router = APIRouter(prefix='/query')

@query_router.post('/', response_class=StreamingResponse)
async def query_rag(req: Query, request: Request):
    return StreamingResponse(query(req.query, 
                                   request.app.state.generation_model, 
                                   request.app.state.reranker,
                                   request.app.state.chroma, 
                                   req.selected_collection_ids, 
                                   req.max_tokens, 
                                   req.n_chunks, 
                                   req.temperature,
                                   req.top_n_chunks), 
                                   media_type='text/event-stream')