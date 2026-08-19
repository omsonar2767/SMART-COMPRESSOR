from typing import Dict, Any

from app.services.chunker import chunk_text
from app.services.bm25_ranker import rank_chunks
from app.services.compressor import compress_context
from app.services.token_counter import calculate_compression


def run_compression_pipeline(
    text: str,
    query: str,
    chunk_size: int = 150,
    chunk_overlap: int = 30,
    top_k: int = 3,
    max_words: int = 150
) -> Dict[str, Any]:
    """
    Run the complete Smart Context Compression pipeline.

    Flow:
        Input Text
            ↓
        Chunking
            ↓
        BM25 Ranking
            ↓
        LLM Compression
            ↓
        Token Analysis
    """

    # Validate input
    if not text or not text.strip():
        raise ValueError("text must not be empty")

    if not query or not query.strip():
        raise ValueError("query must not be empty")

    # --------------------------------------------------
    # 1. CHUNKING
    # --------------------------------------------------

    chunks = chunk_text(
        text,
        chunk_size=chunk_size,
        overlap=chunk_overlap
    )

    if not chunks:
        raise ValueError("No chunks were created")

    # --------------------------------------------------
    # 2. BM25 RANKING
    # --------------------------------------------------

    ranked_chunks = rank_chunks(
        chunks,
        query,
        top_k=top_k
    )

    # Extract chunks from BM25 results
    relevant_chunks = [
        chunk for chunk, score in ranked_chunks
    ]

    # --------------------------------------------------
    # 3. LLM COMPRESSION
    # --------------------------------------------------

    compressed_context = compress_context(
        relevant_chunks,
        query,
        max_words=max_words
    )

    # --------------------------------------------------
    # 4. TOKEN ANALYSIS
    # --------------------------------------------------

    metrics = calculate_compression(
        text,
        compressed_context
    )

    # --------------------------------------------------
    # 5. RETURN RESULT
    # --------------------------------------------------

    return {
        "query": query,
        "total_chunks": len(chunks),
        "selected_chunks": len(relevant_chunks),
        "relevant_chunks": relevant_chunks,
        "compressed_context": compressed_context,
        "metrics": metrics
    }


# ======================================================
# TEST THE COMPLETE PIPELINE
# ======================================================

if __name__ == "__main__":

    text = """
    Smart Context Compression is a system designed to reduce
    unnecessary context sent to a language model.

    The system splits a long conversation into smaller chunks.
    This allows the system to process large amounts of information
    more efficiently.

    BM25 ranks those chunks according to their relevance to the
    current query. The most relevant chunks are selected and sent
    to an LLM.

    The LLM then compresses the selected context while preserving
    important information and removing unnecessary repetition.

    This approach can reduce the number of tokens sent to a language
    model while keeping the important information needed to answer
    the user's query.
    """

    query = "How does BM25 help reduce unnecessary context?"

    print("=" * 60)
    print("SMART CONTEXT COMPRESSION PIPELINE")
    print("=" * 60)

    result = run_compression_pipeline(
        text=text,
        query=query,
        chunk_size=150,
        chunk_overlap=30,
        top_k=2,
        max_words=100
    )

    print("\n--- QUERY ---")
    print(result["query"])

    print("\n--- TOTAL CHUNKS ---")
    print(result["total_chunks"])

    print("\n--- SELECTED CHUNKS ---")
    print(result["selected_chunks"])

    print("\n--- RELEVANT CHUNKS ---")

    for i, chunk in enumerate(
        result["relevant_chunks"],
        start=1
    ):
        print(f"\nChunk {i}:")
        print(chunk)

    print("\n--- COMPRESSED CONTEXT ---")
    print(result["compressed_context"])

    print("\n--- TOKEN METRICS ---")

    metrics = result["metrics"]

    print(f"Original tokens:     {metrics['original_tokens']}")
    print(f"Compressed tokens:   {metrics['compressed_tokens']}")
    print(f"Tokens saved:        {metrics['tokens_saved']}")
    print(f"Reduction:           {metrics['reduction_percentage']}%")

    print("\n" + "=" * 60)
    print("PIPELINE TEST COMPLETED")
    print("=" * 60)