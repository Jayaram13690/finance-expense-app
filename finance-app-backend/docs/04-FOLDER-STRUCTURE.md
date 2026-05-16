# Folder Structure - Finance App Backend

## Table of Contents

1. [Root Directory Structure](#1-root-directory-structure)
2. [app/ Directory](#2-app-directory)
3. [app/api/](#3-appapi)
4. [app/core/](#4-appcore)
5. [app/models/](#5-appmodels)
6. [app/schemas/](#6-appschemas)
7. [app/services/](#7-appservices)
8. [app/repositories/](#8-apprepositories)
9. [docs/ Directory](#9-docs-directory)
10. [tests/ Directory](#10-tests-directory)
11. [Configuration Files](#11-configuration-files)

---

## 1. Root Directory Structure

```
finance-app-backend/
├── app/                  # Main application code
├── docs/                 # Documentation files
├── tests/                # Test files
├── venv/                 # Python virtual environment
├── .gitignore            # Git ignore rules
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── pytest.ini            # Pytest configuration
├── QUICKSTART.md         # Quick start guide
├── README.md             # Main README
└── requirements.txt      # Python dependencies
```

---

## 2. app/ Directory

The main application directory containing all source code.

```
app/
├── api/                  # API routes and endpoints
├── core/                 # Core application components
├── models/               # Database models
├── schemas/              # Pydantic schemas
├── services/             # Business logic services
├── repositories/         # Data access repositories
├── utils/                # Utility functions
├── main.py               # FastAPI application entry point
└── __init__.py           # Python package initialization
```

---

## 3. app/api/

Contains all API route definitions organized by version.

```
app/api/
└── v1/
    ├── routes/           # Individual route modules
    │   ├── auth.py        # Authentication endpoints
    │   ├── transactions.py # Transaction endpoints
    │   ├── budgets.py     # Budget endpoints
    │   ├── pots.py        # Savings pots endpoints
    │   ├── dashboard.py   # Dashboard endpoints
    │   └── __init__.py    # Package initialization
    ├── api.py            # API router aggregator
    └── __init__.py        # Package initialization
```

### Key Files:

- **api.py**: Aggregates all route modules into a single router
- **routes/auth.py**: User registration, login, and profile endpoints
- **routes/transactions.py**: CRUD operations for transactions
- **routes/budgets.py**: CRUD operations for budgets
- **routes/pots.py**: CRUD operations for savings pots
- **routes/dashboard.py**: Dashboard data aggregation endpoints

---

## 4. app/core/

Core application components and configuration.

```
app/core/
├── config.py            # Application configuration
├── database.py          # Database connection setup
├── security.py          # Authentication and security
├── constants.py         # Constants and enums
└── __init__.py          # Package initialization
```

### Key Files:

- **config.py**: Application settings using Pydantic Settings
  - Loads from environment variables and .env file
  - Defines database URL, JWT settings, app name, etc.

- **database.py**: Database connection management
  - Creates async SQLAlchemy engine
  - Provides async session factory
  - Defines `get_db()` dependency for FastAPI

- **security.py**: Authentication and security utilities
  - JWT token creation and verification
  - Password hashing with bcrypt
  - Current user extraction from JWT

- **constants.py**: Application constants and enums
  - Transaction types, categories, etc.

---

## 5. app/models/

SQLAlchemy database models defining the database schema.

```
app/models/
├── user.py             # User model
├── transaction.py      # Transaction model
├── budget.py           # Budget model
├── pot.py              # Savings pot model
├── recurring_bill.py   # Recurring bill model
└── __init__.py         # Package initialization
```

### Key Files:

- **user.py**: User entity with id, name, email, hashed_password, timestamps
- **transaction.py**: Financial transactions with title, amount, type, category, etc.
- **budget.py**: Budget limits by category with spent tracking
- **pot.py**: Savings goals with target amount and current balance
- **recurring_bill.py**: Regular bills with due dates and status

---

## 6. app/schemas/

Pydantic schemas for request/response validation and serialization.

```
app/schemas/
├── user.py             # User schemas
├── transaction.py      # Transaction schemas
├── budget.py           # Budget schemas
├── pot.py              # Pot schemas
├── recurring_bill.py   # Recurring bill schemas
└── __init__.py         # Package initialization
```

### Schema Types:

Each file typically contains:
- **Base**: Common fields for create/update/response
- **Create**: Schema for creating new entities
- **Update**: Schema for updating existing entities (optional fields)
- **Response**: Schema for API responses (includes all fields)
- **Token**: JWT token response schema

---

## 7. app/services/

Business logic services that coordinate between repositories.

```
app/services/
├── auth_service.py     # Authentication services
├── transaction_service.py # Transaction services
├── budget_service.py   # Budget services
├── pot_service.py      # Pot services
├── dashboard_service.py # Dashboard services
└── __init__.py         # Package initialization
```

### Key Files:

- **auth_service.py**: User registration, login, and profile management
- **transaction_service.py**: Transaction CRUD operations and business logic
- **budget_service.py**: Budget management and spending tracking
- **pot_service.py**: Savings pot operations and balance management
- **dashboard_service.py**: Data aggregation for dashboard views

---

## 8. app/repositories/

Data access layer using Repository Pattern.

```
app/repositories/
├── user_repository.py     # User data access
├── transaction_repository.py # Transaction data access
├── budget_repository.py   # Budget data access
├── pot_repository.py      # Pot data access
└── __init__.py            # Package initialization
```

### Key Files:

- **user_repository.py**: CRUD operations for users
- **transaction_repository.py**: CRUD operations for transactions
- **budget_repository.py**: CRUD operations for budgets
- **pot_repository.py**: CRUD operations for savings pots

---

## 9. docs/ Directory

Comprehensive documentation for the application.

```
docs/
├── 01-OVERVIEW.md        # Application overview
├── 02-TECHNOLOGY-STACK.md # Technology stack details
├── 03-ARCHITECTURE.md     # Architecture explanation
├── 04-FOLDER-STRUCTURE.md # This file - folder structure
├── 05-FEATURES.md         # Feature details
├── 06-API-ENDPOINTS.md    # API reference
├── 07-DATA-FLOW.md        # Data flow diagrams
├── 08-CODE-EXPLANATION.md # Code explanations
├── 09-DEPLOYMENT.md       # Deployment guide
└── 10-BEST-PRACTICES.md   # Development practices
```

---

## 10. tests/ Directory

Test files for the application.

```
tests/
├── test_auth.py         # Authentication tests
├── test_transactions.py  # Transaction tests
├── test_budgets.py       # Budget tests
├── test_pots.py          # Pot tests
├── test_dashboard.py     # Dashboard tests
└── conftest.py          # Pytest fixtures
```

---

## 11. Configuration Files

### Root Configuration Files:

- **requirements.txt**: Python dependencies
- **Dockerfile**: Docker build configuration
- **docker-compose.yml**: Docker Compose services
- **pytest.ini**: Pytest configuration
- **.gitignore**: Git ignore rules
- **README.md**: Main project documentation
- **QUICKSTART.md**: Quick start guide

### Environment Files:

- **.env**: Environment variables (not committed to git)
- **.env.example**: Example environment variables

---

## File Count Summary

```
Total Files: ~50+
- Python source files: ~30
- Documentation files: ~10
- Configuration files: ~8
- Test files: ~5
```

---

## Key Design Principles in Folder Structure

1. **Separation of Concerns**: Each directory has a clear responsibility
2. **Modular Design**: Features are organized by domain entity
3. **Layered Architecture**: Clear separation between presentation, business, and data layers
4. **Consistent Naming**: Files follow consistent naming conventions
5. **Single Responsibility**: Each file has a single, clear purpose

---

*Documentation for Finance App Backend v1.0.0*
