# Finance App Backend

A modern, production-ready finance management SaaS backend built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

✅ **User Authentication**
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API endpoints

✅ **Transactions**
- Create, read, update, delete transactions
- Categorize income and expenses
- Pagination support

✅ **Budgets**
- Set budget limits by category
- Automatic spent amount tracking
- Monthly budgets

✅ **Pots (Savings Goals)**
- Create multiple savings goals
- Deposit and withdraw funds
- Theme color customization

✅ **Recurring Bills**
- Track recurring expenses
- Manage bill due dates
- Bill status tracking

✅ **Dashboard**
- Comprehensive overview
- Balance calculations
- Budget summaries
- Pot progress tracking

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Auth**: JWT + Passlib (bcrypt)
- **Async**: asyncpg + SQLAlchemy async
- **Validation**: Pydantic v2
- **API Format**: REST with CRUD operations

## Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone and navigate to project
cd finance-app-backend

# Start services
docker-compose up -d

# API will be available at http://localhost:8000
```

### Option 2: Local Setup

**Prerequisites:**
- Python 3.11+
- PostgreSQL 12+

**Installation:**

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Update .env with your database URL
# Default: postgresql+asyncpg://postgres:postgres@localhost:5432/finance_db

# Run the server
uvicorn app.main:app --reload
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
```
POST   /api/v1/auth/register      - Register new user
POST   /api/v1/auth/login         - Login and get JWT token
GET    /api/v1/auth/me            - Get current user (protected)
```

### Transactions
```
GET    /api/v1/transactions       - List transactions (paginated)
GET    /api/v1/transactions/{id}  - Get transaction details
POST   /api/v1/transactions       - Create transaction
PUT    /api/v1/transactions/{id}  - Update transaction
DELETE /api/v1/transactions/{id}  - Delete transaction
```

### Budgets
```
GET    /api/v1/budgets            - List budgets
GET    /api/v1/budgets/{id}       - Get budget details
POST   /api/v1/budgets            - Create budget
PUT    /api/v1/budgets/{id}       - Update budget
DELETE /api/v1/budgets/{id}       - Delete budget
```

### Pots
```
GET    /api/v1/pots               - List pots
GET    /api/v1/pots/{id}          - Get pot details
POST   /api/v1/pots               - Create pot
PUT    /api/v1/pots/{id}          - Update pot
PATCH  /api/v1/pots/{id}/deposit  - Deposit to pot
PATCH  /api/v1/pots/{id}/withdraw - Withdraw from pot
DELETE /api/v1/pots/{id}          - Delete pot
```

### Dashboard
```
GET    /api/v1/dashboard/overview - Get dashboard overview
```

## Example Requests

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=john@example.com&password=secure_password'
```

### Create Transaction
```bash
curl -X POST http://localhost:8000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Grocery Shopping",
    "amount": 50.00,
    "type": "expense",
    "category": "groceries",
    "description": "Weekly groceries"
  }'
```

### Get Dashboard Overview
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/overview \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── routes/          # Endpoint handlers
│   │       └── api.py           # Route aggregator
│   ├── core/
│   │   ├── config.py            # Settings
│   │   ├── database.py          # DB setup
│   │   ├── security.py          # JWT & auth
│   │   └── constants.py         # Enums
│   ├── models/                  # SQLAlchemy models
│   ├── schemas/                 # Pydantic schemas
│   ├── services/                # Business logic
│   ├── repositories/            # Data access
│   └── main.py                  # FastAPI app
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Environment Variables

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/finance_db
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

## Security Notes

- 🔒 Change `SECRET_KEY` in production
- 🔒 Use environment variables for sensitive data
- 🔒 Enable HTTPS in production
- 🔒 Restrict CORS origins
- 🔒 Use strong database passwords
- 🔒 Never commit `.env` to version control

## Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app
```

## Future Enhancements

- [ ] Alembic migrations
- [ ] Advanced filtering and search
- [ ] Recurring transaction automation
- [ ] Data export (CSV, PDF)
- [ ] Bill notifications
- [ ] Category customization
- [ ] Multi-currency support
- [ ] Spending analytics
- [ ] Webhook integrations

## License

MIT

## Support

For issues and questions, create an issue in the repository.

---

Built with ❤️ using FastAPI
