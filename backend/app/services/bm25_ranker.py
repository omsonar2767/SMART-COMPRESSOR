from typing import List, Tuple

from rank_bm25 import BM25Okapi


def rank_chunks(
    chunks: List[str],
    query: str,
    top_k: int = 3
) -> List[Tuple[str, float]]:
    """
    Rank text chunks according to their relevance to a query using BM25.

    Args:
        chunks: List of text chunks.
        query: User's search/query text.
        top_k: Number of most relevant chunks to return.

    Returns:
        A list of (chunk, score) tuples sorted by relevance.
    """

    if not chunks:
        return []

    if not query or not query.strip():
        raise ValueError("query must not be empty")

    if top_k <= 0:
        raise ValueError("top_k must be greater than 0")

    # Tokenize chunks
    tokenized_chunks = [
        chunk.lower().split()
        for chunk in chunks
    ]

    # Create BM25 model
    bm25 = BM25Okapi(tokenized_chunks)

    # Tokenize query
    tokenized_query = query.lower().split()

    # Calculate relevance scores
    scores = bm25.get_scores(tokenized_query)

    # Combine chunks with their scores
    ranked_chunks = list(zip(chunks, scores))

    # Sort from highest score to lowest score
    ranked_chunks.sort(
        key=lambda item: item[1],
        reverse=True
    )

    # Return only top_k results
    return ranked_chunks[:top_k]


if __name__ == "__main__":
    chunks = [
        "Smart Context Compression reduces unnecessary context sent to a language model.",
        "The system splits a long conversation into smaller chunks.",
        "BM25 ranks chunks according to their relevance to the current query."
    ]

    query = "How does BM25 rank chunks?"

    results = rank_chunks(
        chunks,
        query,
        top_k=2
    )

    print("=" * 50)
    print("BM25 RANKER TEST")
    print("=" * 50)

    for rank, (chunk, score) in enumerate(results, start=1):
        print(f"\n--- Rank {rank} ---")
        print(f"Score: {score:.4f}")
        print(f"Chunk: {chunk}")