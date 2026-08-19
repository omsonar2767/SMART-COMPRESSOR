from app.services.pipeline import run_compression_pipeline


text = """
Python is a high-level programming language known for its simple
and readable syntax. It is widely used in web development, data
science, artificial intelligence, automation, and scripting.

Python supports multiple programming paradigms including procedural,
object-oriented, and functional programming. Its large ecosystem
of libraries makes it useful for many different types of software
development.

Machine learning is a branch of artificial intelligence that allows
computers to learn patterns from data. Common machine learning
algorithms include linear regression, decision trees, support vector
machines, and neural networks.

Deep learning is a subset of machine learning that uses neural
networks with multiple layers. Deep learning is commonly used for
image recognition, speech recognition, natural language processing,
and other complex tasks.

Databases are systems used to store, organize, and retrieve data.
Relational databases store information in tables and commonly use
SQL to query and manipulate data.

Software engineering involves designing, developing, testing, and
maintaining software systems. Good software engineering practices
include version control, testing, documentation, code review, and
continuous integration.

Git is a distributed version control system used to track changes
in source code. Developers use Git to create branches, make commits,
merge changes, and collaborate with other developers.

GitHub is a platform that hosts Git repositories and provides tools
for collaboration. Teams can use GitHub for pull requests, issues,
code reviews, and project management.

FastAPI is a modern Python web framework used for building APIs.
It supports automatic API documentation and uses Python type hints
for request validation.

Artificial intelligence systems often use large language models to
understand and generate natural language. Large language models can
process context and generate responses based on the information
provided to them.

Smart Context Compression is designed to reduce unnecessary context
sent to a language model. The system splits long conversations into
smaller chunks and uses BM25 to identify chunks relevant to the
current query.

BM25 is a ranking algorithm commonly used in information retrieval.
It calculates how relevant a document or text chunk is to a search
query based on term frequency and inverse document frequency.

After BM25 selects the most relevant chunks, an LLM can compress
those chunks while preserving important information and removing
unnecessary repetition. This can reduce token usage and make LLM
requests more efficient.

Token reduction is important because large language model requests
can become expensive and slower when unnecessary context is included.
Reducing irrelevant context can improve efficiency while preserving
the information needed to answer a query.
"""


query = "How does BM25 help Smart Context Compression?"


print("=" * 70)
print("LARGE CONTEXT PIPELINE TEST")
print("=" * 70)


result = run_compression_pipeline(
    text=text,
    query=query,
    chunk_size=100,
    chunk_overlap=20,
    top_k=3,
    max_words=100
)


print("\n--- QUERY ---")
print(result["query"])


print("\n--- CHUNKING ---")
print(f"Total chunks created: {result['total_chunks']}")


print("\n--- BM25 SELECTION ---")
print(f"Chunks selected: {result['selected_chunks']}")


print("\n--- SELECTED CHUNKS ---")

for i, chunk in enumerate(
    result["relevant_chunks"],
    start=1
):
    print(f"\n### Chunk {i}")
    print(chunk)


print("\n--- COMPRESSED CONTEXT ---")
print(result["compressed_context"])


print("\n--- TOKEN METRICS ---")

metrics = result["metrics"]

print(f"Original tokens:     {metrics['original_tokens']}")
print(f"Compressed tokens:   {metrics['compressed_tokens']}")
print(f"Tokens saved:        {metrics['tokens_saved']}")
print(f"Reduction:           {metrics['reduction_percentage']}%")


print("\n" + "=" * 70)
print("LARGE CONTEXT TEST COMPLETED")
print("=" * 70)