# 🚀 Smart Context Compression

### Intelligent, Query-Aware Context Optimization for LLM Applications

> **Reduce LLM token usage without losing the information that matters.**

Smart Context Compression is an intelligent preprocessing system that reduces large amounts of text before sending them to a Large Language Model (LLM).

Instead of passing an entire document to an LLM, the system identifies the information most relevant to the user's query, compresses it, and produces a smaller, query-focused context.

This helps reduce:

* 💰 LLM API costs
* ⚡ Response latency
* 🧠 Context-window usage
* 📦 Prompt size
* 🔄 Unnecessary processing

---

## 🧠 The Problem

Modern LLM applications often provide large amounts of context to an LLM.

For example:

```text
10,000-token document
        ↓
      LLM
        ↓
     Response
```

The problem is that much of those 10,000 tokens may be irrelevant to the user's question.

If the user asks:

> "How does BM25 ranking work?"

There is no reason to send an entire 10,000-token document containing unrelated information.

Smart Context Compression solves this by intelligently filtering and compressing the context before it reaches the downstream LLM.

---

# 💡 The Solution

Our pipeline transforms:

```text
Large Context
     ↓
   Chunking
     ↓
 BM25 Ranking
     ↓
Relevant Chunks
     ↓
LLM Compression
     ↓
Compressed Context
     ↓
Downstream LLM
```

The result is a smaller context containing the information most useful for answering the user's query.

---

# ✨ Key Features

| Feature                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| 🧩 Smart Chunking        | Splits large documents into manageable overlapping chunks    |
| 🔎 BM25 Ranking          | Finds chunks most relevant to the user's query               |
| 🎯 Query-Aware Selection | Prioritizes information based on the actual question         |
| 🤖 LLM Compression       | Removes unnecessary information while preserving key details |
| 🔢 Token Counting        | Measures token usage before and after compression            |
| 📊 Compression Metrics   | Calculates tokens saved and compression percentage           |
| ⚡ FastAPI Backend        | Provides a scalable REST API                                 |
| 📚 Swagger Documentation | Automatically generated interactive API documentation        |
| 🧱 Modular Architecture  | Components can be developed and replaced independently       |
| 🧪 Testable Pipeline     | Individual services and the complete pipeline can be tested  |

---

# 🏗️ System Architecture

```text
                         USER QUERY
                             │
                             ▼
                  ┌────────────────────┐
                  │   Large Context    │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │      Chunker       │
                  │                    │
                  │ Overlapping Chunks │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │    BM25 Ranker     │
                  │                    │
                  │ Query Relevance    │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │  Relevant Chunks   │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │  LLM Compressor    │
                  │                    │
                  │ Remove Redundancy  │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Compressed Context │
                  └─────────┬──────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Downstream   │
                     │     LLM      │
                     └──────────────┘
```

---

# 🔄 How It Works

## 1. Context Input

The system receives two inputs:

### Context

A large document or body of text.

### Query

The user's information requirement.

Example:

```text
Context:
A large technical document containing thousands of words.

Query:
How does BM25 ranking work?
```

---

## 2. Intelligent Chunking

The context is divided into smaller overlapping chunks.

```text
┌─────────────────────────────┐
│ Chunk 1                     │
└─────────────────────────────┘
              │
              │ overlap
              ▼
        ┌─────────────────────────────┐
        │ Chunk 2                     │
        └─────────────────────────────┘
                      │
                      │ overlap
                      ▼
                ┌─────────────────────────────┐
                │ Chunk 3                     │
                └─────────────────────────────┘
```

Overlapping chunks help preserve information that appears near chunk boundaries.

---

## 3. BM25 Relevance Ranking

Each chunk is scored against the user's query using BM25.

Example:

```text
Query:
"How does BM25 ranking work?"

             BM25
               │
       ┌───────┴────────┐
       ▼                ▼
 Chunk 3             Chunk 7
 Score: 8.7          Score: 8.2
   HIGH                HIGH

 Chunk 2             Chunk 9
 Score: 4.1          Score: 1.3
  MEDIUM               LOW
```

Only the most relevant chunks continue through the pipeline.

This prevents irrelevant sections from consuming LLM context.

---

# 🤖 4. LLM-Based Compression

The selected chunks are passed to an LLM with the user's query.

The LLM removes unnecessary content while preserving information needed to answer the query.

```text
Relevant Chunks
       │
       ▼
      LLM
       │
       ▼
Query-Focused Context
```

The compressed context can then be sent to another LLM or application.

---

# 📊 5. Token Optimization

The system measures the difference between the original and compressed contexts.

Example:

```text
┌──────────────────────────────┐
│ Original Tokens       10,000 │
│ Compressed Tokens      1,500 │
│ Tokens Saved            8,500 │
│ Reduction                85% │
└──────────────────────────────┘
```

### Compression Formula

```text
Compression % =
((Original Tokens - Compressed Tokens)
 / Original Tokens) × 100
```

For example:

```text
Original Tokens:      511
Compressed Tokens:     96

Tokens Saved:         415
Compression:       81.21%
```

> Results vary depending on the document, query, tokenizer, BM25 configuration, and LLM output.

---

# 🛠️ Technology Stack

## Backend

* 🐍 Python
* ⚡ FastAPI
* 📦 Pydantic
* 🚀 Uvicorn

## NLP / Retrieval

* Text Chunking
* BM25 Ranking
* Tokenization

## LLM

* LLM API
* Query-aware compression

## Frontend

* HTML
* CSS
* JavaScript

## Development

* Git
* GitHub
* Python Virtual Environment

---

# 📁 Project Structure

```text
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
```

The architecture separates the main responsibilities of the system, making the project easier to maintain, test, and extend.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Python 3.10+
* Git
* An LLM API key
* A modern web browser

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd smart-context-compression
```

---

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv .venv
```

---

## 3. Activate the Environment

### Windows CMD

```bash
.venv\Scripts\activate
```

### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

---

## 4. Install Dependencies

From the project root:

```bash
pip install -r backend/requirements.txt
```

---

# 🔐 Environment Configuration

Create:

```text
backend/.env
```

Add your API key:

```env
GROQ_API_KEY=your_api_key_here
```

### ⚠️ Security

Never commit API keys to GitHub.

Add the following to `.gitignore`:

```gitignore
.env
.venv/
__pycache__/
*.pyc
```

If an API key is accidentally pushed to a public repository, revoke it immediately and generate a new one.

---

# ▶️ Running the Backend

Navigate to the backend:

```bash
cd backend
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

If the `uvicorn` command is unavailable:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

FastAPI automatically generates interactive documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

Swagger allows you to test API endpoints directly from your browser.

---

# 🔌 API Reference

## `POST /compress`

Compresses a large context based on a user's query.

### Request

```json
{
  "context": "Your large context goes here...",
  "query": "What information is relevant to my question?"
}
```

### Response

```json
{
  "compressed_context": "Relevant information...",
  "original_tokens": 511,
  "compressed_tokens": 96,
  "tokens_saved": 415,
  "compression_percentage": 81.21
}
```

---

# 🌐 Running the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Start a local server:

```bash
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

Make sure the FastAPI backend is running simultaneously on port `8000`.

```text
Frontend
localhost:5500
      │
      │ API Request
      ▼
Backend
localhost:8000
      │
      ▼
Compression Pipeline
```

---

# 🧪 Testing

The project contains tests for individual components as well as the complete compression pipeline.

## Test Chunking

From the backend directory:

```bash
python test_chunker.py
```

## Test Complete Pipeline

```bash
python test_pipeline.py
```

The complete pipeline performs:

```text
Input Context
     ↓
Chunking
     ↓
BM25 Ranking
     ↓
Relevant Chunk Selection
     ↓
LLM Compression
     ↓
Token Measurement
     ↓
Compression Metrics
```

---

# 📈 Performance Metrics

Smart Context Compression measures several important metrics.

| Metric            | Purpose                            |
| ----------------- | ---------------------------------- |
| Original Tokens   | Measures the original context size |
| Compressed Tokens | Measures the final context size    |
| Tokens Saved      | Measures tokens removed            |
| Compression %     | Measures overall reduction         |
| Relevance         | Measures query-context relevance   |

### Example

```text
Original Context
       ↓
    10,000 tokens

       ↓

BM25 Selection

       ↓

Relevant Context

       ↓

LLM Compression

       ↓

1,500 tokens
```

Potential reduction:

```text
85% fewer tokens
```

The actual result depends on the input.

---

# 🎯 Example Use Case

Imagine an application has a 10,000-token technical document.

The user asks:

```text
How does BM25 ranking work?
```

### Traditional Approach

```text
10,000 tokens
      ↓
     LLM
      ↓
   Response
```

### Smart Context Compression

```text
10,000 tokens
      ↓
   Chunking
      ↓
 BM25 Ranking
      ↓
Relevant Chunks
      ↓
LLM Compression
      ↓
 1,500 tokens
      ↓
 Downstream LLM
      ↓
   Response
```

Instead of sending the entire document, the system creates a smaller, query-focused context.

---

# 💡 Why This Matters

## 💰 Lower Cost

Fewer input tokens can reduce LLM API costs.

## ⚡ Lower Latency

Smaller prompts can reduce processing requirements.

## 🧠 Better Context

The downstream LLM receives information that is more relevant to the user's question.

## 📦 Efficient Context Windows

Applications can fit more useful information into limited context windows.

## 🎯 Query-Aware Processing

The system doesn't simply summarize everything.

It first asks:

> **"Which parts of this context actually matter for this query?"**

Then it compresses those parts.

---

# 🧩 Design Principles

### Query First

The user's query determines what information is important.

### Retrieve Before Compressing

Relevant information is selected before the LLM performs compression.

### Preserve Important Information

Compression should reduce redundancy without removing information required to answer the query.

### Measure Everything

Token counts provide measurable evidence of optimization.

### Keep Components Modular

Each stage can be independently improved or replaced.

---

# 🗺️ Roadmap

* [ ] PDF and document uploads
* [ ] Multiple document support
* [ ] Multiple compression strategies
* [ ] Compression quality scoring
* [ ] Relevance evaluation
* [ ] Vector-based retrieval
* [ ] Hybrid BM25 + vector search
* [ ] Streaming responses
* [ ] Authentication
* [ ] Rate limiting
* [ ] Production deployment
* [ ] Performance analytics
* [ ] Token-cost estimation
* [ ] Compression history
* [ ] Advanced analytics dashboard

---

# 🔮 Future Vision

Smart Context Compression is designed to become a **general-purpose context optimization layer for LLM applications**.

Instead of applications directly sending large amounts of information to an LLM:

```text
                    ┌─────────────────┐
                    │   Application   │
                    └────────┬────────┘
                             │
                             ▼
              ┌───────────────────────────┐
              │ Smart Context Compression │
              └─────────────┬─────────────┘
                            │
                            ▼
                 Relevant + Compressed
                       Context
                            │
                            ▼
                     ┌────────────┐
                     │    LLM     │
                     └─────┬──────┘
                           │
                           ▼
                        Response
```

This architecture can be integrated into:

* RAG applications
* AI assistants
* Document analysis systems
* Enterprise search
* Chatbots
* Agentic AI systems
* Knowledge-management platforms
* LLM-powered applications

---

# 🔒 Security

Security is an important part of the project.

### Never commit:

```text
API keys
Passwords
Access tokens
.env files
Private credentials
```

Use environment variables instead:

```env
GROQ_API_KEY=your_api_key_here
```

And keep `.env` in `.gitignore`.

---

# 🤝 Contributing

Contributions and suggestions are welcome.

### Fork the repository

```bash
git clone <your-repository-url>
cd smart-context-compression
```

### Create a feature branch

```bash
git checkout -b feature/your-feature
```

### Install dependencies

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

### Make your changes

Test the pipeline before submitting a pull request.

```bash
python test_chunker.py
python test_pipeline.py
```

Then commit your changes:

```bash
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

# 📄 License

This project is currently intended for development and educational purposes.

Before publishing the project publicly, add an open-source license such as the **MIT License**.

---

# 👨‍💻 Author

## Satyam

**Smart Context Compression**

> Building intelligent systems that make LLM applications more efficient.

---

# ⭐ Support

If you find **Smart Context Compression** useful:

⭐ Star the repository
🐛 Report issues
💡 Suggest improvements
🤝 Contribute to the project

---

## 🚀 Smart Context Compression

> **Don't send everything to the LLM. Send what matters.**
