# QUICK START GUIDE

## 🚀 Option 1: Run with Docker (Easiest)

### Prerequisites
- Docker & Docker Compose installed

### Steps

```bash
# Navigate to project directory
cd finance-app-backend

# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f backend
```

✅ API available at: **http://localhost:8000**
✅ Swagger Docs: **http://localhost:8000/docs**
✅ PostgreSQL: **localhost:5432**

### First Time Setup
Wait 10-15 seconds for PostgreSQL to be ready, then test:

```bash
# Health check
curl http://localhost:8000/health

# You should see: {"status":"ok","app":"Finance App"}
```

### Stopping Services
```bash
docker-compose down
```

---

## 🐍 Option 2: Run Locally (Python)

### Prerequisites
- Python 3.11+
- PostgreSQL 12+ running locally
- pip package manager

### Steps

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure database
# Edit .env file:
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/finance_db

# Make sure PostgreSQL is running on your machine!

# 5. Run the server
uvicorn app.main:app --reload

# Server will start at http://localhost:8000
```

---

## 📝 Testing the API

### Register a User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=john@example.com&password=secure_password_123'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Copy the access_token for next requests!**

### Create a Transaction
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

### Get Transactions
```bash
curl -X GET http://localhost:8000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create a Budget
```bash
curl -X POST http://localhost:8000/api/v1/budgets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "groceries",
    "limit_amount": 500.00,
    "month": 1,
    "year": 2024
  }'
```

### Create a Pot (Savings Goal)
```bash
curl -X POST http://localhost:8000/api/v1/pots \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vacation Fund",
    "target_amount": 5000.00,
    "theme_color": "blue"
  }'
```

### Deposit to Pot
```bash
curl -X PATCH http://localhost:8000/api/v1/pots/1/deposit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00
  }'
```

### Get Dashboard Overview
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/overview \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔍 View API Documentation

### Swagger UI (Interactive)
```
http://localhost:8000/docs
```

### ReDoc (Clean Documentation)
```
http://localhost:8000/redoc
```

Try out endpoints directly in Swagger UI!

---

## 🐛 Troubleshooting

### Docker Issues

**"Connection refused" when accessing API**
- Wait 15 seconds for PostgreSQL to fully start
- Check: `docker-compose logs postgres`

**"Database already exists" error**
- Remove volume: `docker-compose down -v`
- Restart: `docker-compose up -d`

### Local Python Issues

**"ModuleNotFoundError" when running uvicorn**
- Make sure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt`

**"Connection refused" to PostgreSQL**
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in .env file

**Port 8000 already in use**
- Use different port: `uvicorn app.main:app --port 8001`

---

## 📊 Project Structure Quick Reference

```
finance-app-backend/
├── app/
│   ├── api/v1/routes/     ← API endpoints (auth, transactions, etc)
│   ├── core/              ← Configuration, database, security
│   ├── models/            ← SQLAlchemy database models
│   ├── schemas/           ← Pydantic validation schemas
│   ├── services/          ← Business logic
│   ├── repositories/      ← Database queries
│   ├── utils/             ← Helper functions
│   └── main.py            ← FastAPI app entry point
├── tests/                 ← Test files
├── requirements.txt       ← Python dependencies
├── docker-compose.yml     ← Docker setup
├── Dockerfile             ← Backend container definition
├── .env                   ← Environment variables
└── README.md              ← Full documentation
```

---

## 📚 Key Features Implemented

✅ **User Management**
- Register new users
- Login with JWT tokens
- Protected endpoints

✅ **Transactions**
- Create, read, update, delete
- Categorize as income/expense
- Pagination support
- Auto-update budgets

✅ **Budgets**
- Set spending limits by category
- Track spent amount
- Monthly budgeting

✅ **Pots (Savings Goals)**
- Create multiple savings goals
- Deposit and withdraw funds
- Progress tracking

✅ **Dashboard**
- Total balance calculation
- Income/expense summary
- Budget status
- Recent transactions
- Pot progress

---

## 🔒 Security Notes

1. **Change SECRET_KEY** in `.env` before production
2. **Never commit** `.env` file to git
3. Use **HTTPS** in production
4. Set **CORS_ORIGINS** to specific domains
5. Use **strong passwords** for PostgreSQL

---

## 🆘 Need Help?

### Common Issues

**1. Can't connect to database**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify credentials

**2. Token not working**
   - Token may have expired (30 min default)
   - Get new token with login
   - Include "Bearer " prefix

**3. 404 errors on endpoints**
   - Check URL is exactly `/api/v1/...`
   - Verify HTTP method (GET, POST, etc)
   - Check token in Authorization header

---

## 🚀 Next Steps

1. ✅ Start the server (Docker or local)
2. ✅ Register a test user
3. ✅ Login and get token
4. ✅ Create some transactions
5. ✅ View dashboard overview
6. ✅ Read full README.md for more details

---

Enjoy! 🎉
