import os
from typing import List

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

load_dotenv()


def compress_context(
    chunks: List[str],
    query: str,
    max_words: int = 150
) -> str:
    """
    Compress relevant context while preserving information
    important to the user's query.

    Args:
        chunks: Relevant chunks selected by BM25.
        query: User's query.
        max_words: Approximate maximum number of words
                   allowed in the compressed context.

    Returns:
        Compressed context as a string.
    """

    if not chunks:
        return ""

    if not query or not query.strip():
        raise ValueError("query must not be empty")

    if max_words <= 0:
        raise ValueError("max_words must be greater than 0")

    # Combine the relevant chunks
    context = "\n\n".join(chunks)

    prompt = f"""
You are a context compression system.

Your task is to compress the provided context for a language model.

IMPORTANT RULES:
1. Preserve information that is relevant to the query.
2. Remove repetition and unnecessary wording.
3. Do not invent new information.
4. Do not change important facts.
5. Keep names, numbers, definitions, and technical terms.
6. Make the result concise and easy for another LLM to understand.
7. Keep the compressed context within approximately {max_words} words.

USER QUERY:
{query}

CONTEXT:
{context}

Return ONLY the compressed context.
"""

    # Create the LLM
    llm = ChatGroq(
        model="openai/gpt-oss-20b",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY")
    )

    # Send request to the LLM
    response = llm.invoke(
        [HumanMessage(content=prompt)]
    )

    return response.content.strip()


if __name__ == "__main__":
    chunks = [
        "Smart Context Compression is a system designed to reduce unnecessary context sent to a language model.",
        "The system splits a long conversation into smaller chunks.",
        "BM25 ranks those chunks according to their relevance to the current query."
    ]

    query = "How does BM25 help Smart Context Compression?"

    print("=" * 50)
    print("CONTEXT COMPRESSOR TEST")
    print("=" * 50)

    compressed = compress_context(
        chunks,
        query,
        max_words=80
    )

    print("\n--- Original Context ---")
    print("\n".join(chunks))

    print("\n--- Compressed Context ---")
    print(compressed)