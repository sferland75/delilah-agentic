# Delilah Agentic Frontend Setup

## Prerequisites
1. Node.js (v16 or later)
2. npm or yarn
3. Python (for backend data generation)

## Setup Steps
1. Generate Test Data
```bash
cd delilah-agentic
python tests/test_runner.py
```

2. Frontend Installation
```bash
cd frontend
npm install  # or yarn install
```

3. Start Development Server
```bash
npm start  # or yarn start
```

## Accessing Test Data
- Dashboard: `http://localhost:3000/`
- Assessment List: `http://localhost:3000/assessments`
- Raw Test Data: `http://localhost:3000/data/test_data.html`

## Troubleshooting
- Ensure test data is generated before starting frontend
- Check console for any import/data loading errors
