from app.services.chunker import chunk_text


text = """
Smart Context Compression is a system designed to reduce unnecessary
context sent to a language model. The system splits a long conversation
into smaller chunks. BM25 ranks those chunks according to their relevance
to the current query.
"""


chunks = chunk_text(text, chunk_size=20, overlap=5)

print("Number of chunks:", len(chunks))

for i, chunk in enumerate(chunks, start=1):
    print(f"\n--- Chunk {i} ---")
    print(chunk)