# Delilah Agentic

Modular Agentic Application for Occupational Therapy Field Assessments

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the web interface:
```bash
# Start the backend API
uvicorn api:app --reload

# The frontend React component can be integrated into your React application
```

3. Or run the CLI demo:
```bash
python cli.py
```

## Components

- Assessment Agent: Guides through assessment protocols
- Documentation Agent: Handles data capture and storage
- Analysis Agent: Processes assessment data
- Report Agent: Generates assessment reports
- Coordinator: Manages inter-agent communication
- Web Interface: React-based user interface

## Project Structure

- `/agents`: Core agent implementations
- `coordinator.py`: Agent coordination logic
- `cli.py`: Command-line interface
- `api.py`: FastAPI backend for web interface
