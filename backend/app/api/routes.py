import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Optional: use your real services if they're importable.
# If any import fails, we fall back to the self-contained logic below so the
# API still works end-to-end. Once your services/pipeline.py is finalized,
# swap the fallback calls for these.
# ---------------------------------------------------------------------------
try:
    from rank_bm25 import BM25Okapi
    HAS_BM25 = True
except ImportError:
    HAS_BM25 = False

try:
    import tiktoken
    _enc = tiktoken.get_encoding("cl100k_base")

    def count_tokens(text: str) -> int:
        return len(_enc.encode(text))
except ImportError:
    def count_tokens(text: str) -> int:
        # rough fallback: ~4 chars per token
        return max(0, round(len(text.strip()) / 4))


router = APIRouter()


# ---------------------------------------------------------------------------
# Request / response schemas — field names MUST match script.js exactly
# ---------------------------------------------------------------------------
class CompressRequest(BaseModel):
    context: str
    query: str


class CompressResponse(BaseModel):
    original_tokens: int
    compressed_tokens: int
    reduction: int
    compressed_context: str
    total_chunks: int
    selected_chunks: int
    discarded_chunks: int


# ---------------------------------------------------------------------------
# Pipeline helpers
# ---------------------------------------------------------------------------
def chunk_text(text: str) -> list[str]:
    """Split context into paragraph-level chunks."""
    chunks = [c.strip() for c in re.split(r"\n\s*\n", text) if c.strip()]
    return chunks if chunks else [text.strip()]


def rank_chunks(chunks: list[str], query: str) -> list[float]:
    """Return a relevance score (0-1) per chunk, query being most relevant first."""
    if HAS_BM25:
        tokenized_corpus = [c.lower().split() for c in chunks]
        bm25 = BM25Okapi(tokenized_corpus)
        scores = bm25.get_scores(query.lower().split())
        max_score = max(scores) if len(scores) and max(scores) > 0 else 1
        return [round(s / max_score, 2) for s in scores]
    else:
        # simple keyword-overlap fallback if rank_bm25 isn't installed
        query_words = set(query.lower().split())
        scores = []
        for c in chunks:
            chunk_words = set(c.lower().split())
            overlap = len(query_words & chunk_words)
            scores.append(overlap / max(len(query_words), 1))
        max_score = max(scores) if scores and max(scores) > 0 else 1
        return [round(s / max_score, 2) for s in scores]


def select_chunks(chunks: list[str], scores: list[float], threshold: float = 0.5):
    """Keep chunks scoring above threshold (relative to top score)."""
    selected = [(c, s) for c, s in zip(chunks, scores) if s >= threshold]
    if not selected:  # always keep at least the best chunk
        best_idx = scores.index(max(scores))
        selected = [(chunks[best_idx], scores[best_idx])]
    return selected


def compress_chunks(selected: list[tuple[str, float]]) -> str:
    """Join selected chunks into the final compressed context."""
    return "\n\n".join(c for c, _ in selected)


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------
@router.post("/compress", response_model=CompressResponse)
def compress_text(payload: CompressRequest):
    context = payload.context.strip()
    query = payload.query.strip()

    if not context:
        raise HTTPException(status_code=400, detail="Context field cannot be empty.")
    if not query:
        raise HTTPException(status_code=400, detail="Query field cannot be empty.")

    try:
        chunks = chunk_text(context)
        scores = rank_chunks(chunks, query)
        selected = select_chunks(chunks, scores)
        compressed_context = compress_chunks(selected)

        original_tokens = count_tokens(context)
        compressed_tokens = count_tokens(compressed_context)
        reduction = (
            round((1 - compressed_tokens / original_tokens) * 100)
            if original_tokens > 0
            else 0
        )

        return CompressResponse(
            original_tokens=original_tokens,
            compressed_tokens=compressed_tokens,
            reduction=max(0, reduction),
            compressed_context=compressed_context,
            total_chunks=len(chunks),
            selected_chunks=len(selected),
            discarded_chunks=len(chunks) - len(selected),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")