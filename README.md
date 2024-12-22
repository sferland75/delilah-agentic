# Delilah Agentic

Modular AI system for Occupational Therapy field assessments and reporting, combining specialized agents for assessment, analysis, and reporting.

## Project Overview
Delilah Agentic provides a comprehensive solution for Occupational Therapy practitioners to conduct field assessments and generate detailed reports using specialized AI agents.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.9+
- PostgreSQL 13+

### Installation
1. Clone the repository
```bash
git clone https://github.com/sferland75/delilah-agentic.git
cd delilah-agentic
```

2. Install dependencies
```bash
npm install
```

3. Set up environment
```bash
cp .env.example .env
# Configure your .env file
```

4. Initialize database
```bash
python create_mydb.py
python -m alembic upgrade head
```

5. Start development server
```bash
npm run dev
```

## Documentation
- [API Documentation](docs/API.md)
- [Development Guidelines](docs/CONTRIBUTING.md)
- [Security Policy](docs/SECURITY.md)

## Contributing
Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.