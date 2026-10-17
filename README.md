Legacy Code & Data Migration Engine 🚀

An enterprise-grade, dynamic AST-based parsing engine designed to analyze unstructured legacy source code, domain-specific languages (DSLs), and system log dumps. Built to accelerate cloud migration workflows, automate data extraction, and generate audit-ready reporting.

🌟 Key Features

Dynamic Token & Syntax Parsing: Configurable boundary markers (MODULE_START / MODULE_END) and custom regular expression capturing groups.

Robust Field Extractions: Automatically detects and parses integers, floats, dates, and strings.

Multi-Format Output Generation: Exposes clean JSON APIs for microservice integration and generates formatted Excel audit reports (.xlsx).

Modern Executive Dashboard: React-based dashboard for drag-and-drop file imports, real-time regex mapping, and live data validation.

Production-Ready FastAPI Backend: High-performance, asynchronous Python backend with CORS, fault-tolerant text decoding, and automatic file handling.

🏗️ System Architecture

[ Client Upload (.dsl / .txt / .log) ]
                 │
                 ▼ (React Frontend / Dashboard)
        [ API Gateway (FastAPI) ]
                 │
  ┌──────────────┴──────────────┐
  ▼                             ▼
[ Dynamic Lexer & Parser ]   [ Excel Exporter ]
(AST Building & RegEx)      (OpenPyXL / Pandas)
  │                             │
  └──────────────┬──────────────┘
                 ▼
 [ JSON Payload & Excel Audit Report ]


🛠️ Tech Stack

Backend: Python 3.10+, FastAPI, Uvicorn, Pandas, OpenPyXL

Frontend: React.js, Tailwind CSS / Custom Inline Styling, Axios

Parser Core: Abstract Syntax Tree (AST) building, Regex matching engine

🚀 Quick Start Guide

1. Prerequisites

Python 3.10+

Node.js & npm / yarn

2. Backend Setup (FastAPI)

# Clone the repository
git clone https://github.com/your-username/legacy-migration-engine.git
cd legacy-migration-engine

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload


The API will be live at http://127.0.0.1:8000.

3. Frontend Setup (React)

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start


🧪 Testing with Example Mock Data

You can quickly verify the system using a mock legacy file:

Sample Legacy Code (migration_test.dsl)

MODULE_START
  ID: MIG-CLI-101
  CLIENT_NAME = "Alpha Global Industries"
  STATUS = "ACTIVE"
  BALANCE = 1250000.75
MODULE_END

MODULE_START
  ID: MIG-CLI-102
  CLIENT_NAME = "Beta Systems Tunisia"
  STATUS = "PENDING"
  BALANCE = 75400.00
MODULE_END


Form Configuration Matrix

Start Marker: MODULE_START

End Marker: MODULE_END

Field Definitions:

id ➔ ID:\s*([A-Z0-9-]+)

client_name ➔ CLIENT_NAME\s*=\s*"([^"]+)"

status ➔ STATUS\s*=\s*"([^"]+)"

balance ➔ BALANCE\s*=\s*([\d\.]+)

📄 API Reference

POST /api/v1/parse/dynamic

Extracts structured records from raw files using dynamic template metadata.

Form Data Parameters:

file: Uploaded .dsl / .txt file

template_json: Configuration JSON string specifying boundary markers and field regexes.

Response Example:

{
  "filename": "migration_test.dsl",
  "status": "success",
  "extracted_count": 2,
  "data": [
    {
      "id": "MIG-CLI-101",
      "client_name": "Alpha Global Industries",
      "status": "ACTIVE",
      "balance": 1250000.75
    }
  ],
  "excel_download_ready": "/api/v1/download/dynamic_report_migration_test.xlsx"
}


💼 Business Impact & Value Proposition

Manual migration of legacy enterprise codebases and unformatted database logs typically takes weeks of brittle scripting and manual spreadsheet reconciliation. This engine automates data extraction, enforces structural validation, and produces instant audit reports, reducing migration timelines from weeks to minutes.
