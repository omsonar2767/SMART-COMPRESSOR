from typing import Dict

import tiktoken


def count_tokens(text: str, model: str = "gpt-4o-mini") -> int:
    """
    Count the number of tokens in a text.

    Args:
        text: Text whose tokens should be counted.
        model: Model encoding to use.

    Returns:
        Number of tokens.
    """

    if not text:
        return 0

    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")

    return len(encoding.encode(text))


def calculate_compression(
    original_text: str,
    compressed_text: str
) -> Dict[str, float]:
    """
    Calculate token reduction caused by compression.

    Returns:
        Dictionary containing original tokens,
        compressed tokens, tokens saved, and reduction percentage.
    """

    original_tokens = count_tokens(original_text)
    compressed_tokens = count_tokens(compressed_text)

    tokens_saved = original_tokens - compressed_tokens

    if original_tokens > 0:
        reduction_percentage = (
            tokens_saved / original_tokens
        ) * 100
    else:
        reduction_percentage = 0.0

    return {
        "original_tokens": original_tokens,
        "compressed_tokens": compressed_tokens,
        "tokens_saved": tokens_saved,
        "reduction_percentage": round(reduction_percentage, 2)
    }


if __name__ == "__main__":

    original_text = """
    Smart Context Compression is a system designed to reduce
    unnecessary context sent to a language model. The system
    splits a long conversation into smaller chunks. BM25 ranks
    those chunks according to their relevance to the current
    query. The most relevant chunks are then passed to an LLM
    which compresses the context while preserving important
    information.
    """

    compressed_text = """
    Smart Context Compression splits conversations into chunks,
    uses BM25 to find relevant information, and uses an LLM to
    compress the selected context while preserving important
    information.
    """

    result = calculate_compression(
        original_text,
        compressed_text
    )

    print("=" * 50)
    print("TOKEN COUNTER TEST")
    print("=" * 50)

    print(f"\nOriginal tokens:     {result['original_tokens']}")
    print(f"Compressed tokens:   {result['compressed_tokens']}")
    print(f"Tokens saved:        {result['tokens_saved']}")
    print(f"Reduction:           {result['reduction_percentage']}%")