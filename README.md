Smart Context Compression

An intelligent context compression system that reduces large amounts of text before sending them to an LLM while preserving the information most relevant to a user's query.

Overview

Large Language Models (LLMs) have limited context windows. Sending unnecessary information increases:

Token usage
API costs
Response latency
Prompt size
Processing overhead

Smart Context Compression addresses this problem by intelligently selecting and compressing only the most relevant portions of a large context before it is sent to an LLM.

Instead of sending an entire document directly to an LLM, the system processes the context through a query-aware compression pipeline:

Large Context
      ↓
   Chunking
      ↓
BM25 Relevance Ranking
      ↓
 Relevant Chunks
      ↓
 LLM Compression
      ↓
 Compressed Context
      ↓
 LLM / Application


The primary goal is to significantly reduce the number of tokens while preserving the information required to answer the user's query.

Key Features
Intelligent text chunking
Overlapping chunks for better context preservation
BM25-based relevance ranking
Query-aware context selection
LLM-based context compression
Token counting
Token reduction measurement
Compression percentage calculation
Modular backend architecture
FastAPI REST API
Interactive API documentation
Frontend interface
Testable compression pipeline
How It Works
1. Input Context

The system receives two primary inputs:

Context

A large document or body of text containing potentially relevant and irrelevant information.

Query

The user's question or information requirement.

Example:

Context:
A large document containing hundreds or thousands of words.

Query:
How does BM25 ranking work?

2. Text Chunking

The large context is divided into smaller chunks.

                 Document
                    ↓
              ┌──────────┐
              │ Chunk 1  │
              └──────────┘
                    ↓
              ┌──────────┐
              │ Chunk 2  │
              └──────────┘
                    ↓
              ┌──────────┐
              │ Chunk 3  │
              └──────────┘
                    ↓
                   ...


The system uses overlapping chunks so that important information near chunk boundaries is less likely to be lost.

3. BM25 Relevance Ranking

After chunking, each chunk is ranked according to its relevance to the user's query.

                Query
                  ↓
                BM25
                  ↓
       ┌─────────────────────┐
       │ Chunk 3 → High      │
       │ Chunk 7 → High      │
       │ Chunk 2 → Medium    │
       │ Chunk 9 → Low       │
       └─────────────────────┘


The highest-scoring chunks are selected for the next stage.

This prevents the LLM from processing large amounts of information that are unrelated to the user's question.

4. LLM-Based Compression

The selected chunks are passed to an LLM.

The LLM removes unnecessary information while preserving information relevant to the query.

Selected Context
       ↓
      LLM
       ↓
Compressed Context


The result is a smaller, query-focused context that can be passed to another LLM or application.

5. Token Comparison

The system measures the effectiveness of compression by comparing token counts before and after compression.

Example:

Original Tokens:       511
Compressed Tokens:      96
Tokens Saved:          415
Reduction:          81.21%


Compression percentage is calculated using:

Compression % =
((Original Tokens - Compressed Tokens)
 / Original Tokens) × 100


A higher percentage indicates greater token reduction.

System Architecture
                    User Query
                        │
                        ▼
              ┌──────────────────┐
              │  Large Context   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │     Chunker      │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  BM25 Ranker     │◄──── Query
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Relevant Chunks  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ LLM Compressor   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Compressed       │
              │ Context          │
              └────────┬─────────┘
                       │
                       ▼
                  LLM / App

Project Architecture
smart-context-compression/
│
├── backend/
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   │
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   └── settings.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── chunker.py
│   │   │   ├── bm25_ranker.py
│   │   │   ├── compressor.py
│   │   │   └── token_counter.py
│   │   │
│   │   ├── schemas/
│   │   │   └── ...
│   │   │
│   │   └── routes/
│   │       └── ...
│   │
│   ├── tests/
│   │   ├── test_chunker.py
│   │   └── test_pipeline.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
├── README.md
└── ...


The project structure is modular so that individual components can be developed, tested, and replaced independently.

Technology Stack
Backend
Python
FastAPI
Pydantic
Uvicorn
NLP / Retrieval
Text chunking
BM25 relevance ranking
Tokenization
LLM
LLM API for intelligent context compression
Frontend
HTML
CSS
JavaScript
Development
Git
GitHub
Python virtual environment
Installation
1. Clone the Repository
git clone <your-repository-url>
cd smart-context-compression

2. Create a Virtual Environment
Windows
python -m venv .venv

3. Activate the Virtual Environment
Windows CMD
.venv\Scripts\activate

Windows PowerShell
.venv\Scripts\Activate.ps1

4. Install Dependencies

From the project root:

pip install -r backend/requirements.txt

Environment Variables

Create a .env file inside the backend directory.

Example:

GROQ_API_KEY=your_api_key_here


Important: Never commit your .env file or API keys to GitHub.

Make sure .env is included in your .gitignore file:

.env
.venv/
__pycache__/
*.pyc

Running the Compression Pipeline

Navigate to the backend directory:

cd backend


Run the pipeline test:

python test_pipeline.py


The test runs the complete compression pipeline:

Original Context
       ↓
   Chunking
       ↓
BM25 Ranking
       ↓
Relevant Chunks
       ↓
LLM Compression
       ↓
Token Comparison


A successful pipeline test may produce output similar to:

Original Tokens:       511
Compressed Tokens:      96
Tokens Saved:          415
Compression:        81.21%


The exact results will vary depending on the input context, query, tokenizer, ranking configuration, and LLM response.

Running the FastAPI Backend

From the backend directory:

uvicorn app.main:app --reload --port 8000


The API will be available at:

http://127.0.0.1:8000


You can also use:

python -m uvicorn app.main:app --reload --port 8000


if the uvicorn command is not available directly.

API Documentation

FastAPI automatically provides interactive API documentation.

Swagger UI
http://127.0.0.1:8000/docs

ReDoc
http://127.0.0.1:8000/redoc


Swagger UI can be used to send requests directly to the API and inspect responses.

API Endpoint
POST /compress

The /compress endpoint accepts a context and query and returns a compressed context along with token-level metrics.

Request
{
  "context": "Your large context goes here...",
  "query": "What information is relevant to my question?"
}

Response
{
  "compressed_context": "Relevant information...",
  "original_tokens": 511,
  "compressed_tokens": 96,
  "tokens_saved": 415,
  "compression_percentage": 81.21
}


The exact response structure may evolve as the API implementation develops.

Frontend

The project also includes a lightweight frontend built with:

HTML
CSS
JavaScript

The frontend provides an interface for submitting context and queries to the backend compression API.

If using Python's built-in HTTP server, navigate to the frontend directory:

cd frontend


Start the frontend server:

python -m http.server 5500


Then open:

http://localhost:5500


Make sure the FastAPI backend is also running on port 8000.

Testing

The project contains tests for individual components and the complete compression pipeline.

Test the Chunker
python test_chunker.py

Test the Complete Pipeline
python test_pipeline.py


These tests help verify that changes to individual components do not break the overall compression workflow.

Performance Metrics

Smart Context Compression focuses on measuring the following metrics:

Metric	Description
Original Tokens	Number of tokens before compression
Compressed Tokens	Number of tokens after compression
Tokens Saved	Difference between original and compressed tokens
Compression %	Percentage reduction in token count
Relevance	How well selected context matches the query
Compression Percentage

The compression percentage is calculated as:

Compression % =
((Original Tokens - Compressed Tokens)
 / Original Tokens) × 100

Example
Original Tokens:       511
Compressed Tokens:      96

Tokens Saved:          415
Compression:        81.21%

Why Smart Context Compression?
Reduced Token Usage

Only relevant information is sent to the downstream LLM.

Lower Cost

Reducing input tokens can lower LLM API costs.

Lower Latency

Smaller prompts can reduce the amount of information the LLM needs to process.

Better Context Quality

Irrelevant information is removed before reaching the downstream LLM.

Query-Aware Compression

The system does not blindly summarize the entire document.

Instead, it first identifies information relevant to the user's query and then compresses the selected context.

Example Workflow

Suppose an application has a document containing 10,000 tokens.

The user asks:

How does BM25 ranking work?


Instead of sending all 10,000 tokens to an LLM:

10,000 Token Document
        ↓
      Chunking
        ↓
   BM25 Ranking
        ↓
 Relevant Chunks
        ↓
 LLM Compression
        ↓
   1,500 Tokens
        ↓
 Downstream LLM


This can significantly reduce the amount of context that needs to be processed.

The actual reduction depends on the input document, query, chunking configuration, BM25 ranking, compression strategy, and LLM output.

Advantages
Intelligent Retrieval

BM25 identifies the sections most relevant to the user's query.

Context Preservation

Overlapping chunks help reduce information loss at chunk boundaries.

Modular Design

Chunking, ranking, compression, and token counting are separated into independent services.

Measurable Results

The system provides token counts and compression metrics to evaluate performance.

LLM-Agnostic Architecture

The compression layer can serve as an intermediate optimization step before a downstream LLM.

Future Improvements

Planned improvements include:

 PDF/document uploads
 Multiple compression strategies
 Improved relevance evaluation
 Compression quality scoring
 Vector-based retrieval
 Streaming responses
 Authentication
 Production deployment
 Performance optimization
 Detailed analytics dashboard
Future Vision

The long-term goal is to build a general-purpose context optimization layer for LLM applications.

Instead of applications directly sending large amounts of information to an LLM, they can route their context through Smart Context Compression first.

Application
     ↓
Smart Context Compression
     ↓
Relevant + Compressed Context
     ↓
LLM
     ↓
Response


This architecture can help applications reduce unnecessary token usage while maintaining the information required for high-quality responses.

Project Goal

The primary goal of Smart Context Compression is:

Reduce LLM context size intelligently without losing the information that matters.

The project combines:

Text Chunking
      +
BM25 Retrieval
      +
Query Relevance
      +
LLM Compression
      +
Token Measurement
      ↓
Smart Context Optimization


The result is a modular pipeline that can act as a preprocessing layer between applications and LLMs.

Contributing

Contributions, suggestions, and improvements are welcome.

A typical workflow:

git clone <your-repository-url>
cd smart-context-compression

python -m venv .venv
.venv\Scripts\activate

pip install -r backend/requirements.txt


Create a feature branch:

git checkout -b feature/your-feature


Make your changes, test them, and submit a pull request.

Security

Never commit API keys or other secrets to the repository.

Use environment variables for sensitive configuration:

GROQ_API_KEY=your_api_key_here


Add the environment file to .gitignore:

.env


If an API key is accidentally exposed, revoke it immediately and generate a new one.

License

This project is currently available for development and educational purposes.

Add your preferred open-source license here, such as the MIT License, before publishing the repository.

Author

Satyam

Smart Context Compression — an intelligent context optimization system for LLM applications.

⭐ If You Find This Project Useful

Consider giving the repository a ⭐ on GitHub and sharing feedback or suggestions for improving the compression pipeline.