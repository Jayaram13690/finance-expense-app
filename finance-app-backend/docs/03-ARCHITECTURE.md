# Application Architecture - Finance App Backend

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Design Patterns](#2-design-patterns)
3. [Layered Architecture](#3-layered-architecture)
4. [Request Flow](#4-request-flow)
5. [Dependency Injection](#5-dependency-injection)
6. [Async Architecture](#6-async-architecture)

---

## 1. Architecture Overview

The Finance App Backend follows a **Clean Architecture** approach with **Layered Architecture** and **Repository Pattern**, optimized for async Python with FastAPI.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Mobile/Web)                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    FastAPI Application                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │   │
│  │  │ API Router   │  │  Middleware   │  │  Exception Handler │    │   │
│  │  │  (routes/)    │  │   (CORS)      │  │                    │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Services Layer                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │   │
│  │  │ AuthService  │  │TransactionSvc│  │  BudgetService    │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘    │   │
│  │                    (app/services/)                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Repositories Layer                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │   │
│  │  │UserRepository│  │TransactionRep│  │  BudgetRepository │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘    │   │
│  │                    (app/repositories/)                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                            │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │   SQLAlchemy Models  │  │   Database Connection │                   │
│  │   (app/models/)      │  │   (app/core/database)│                   │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                    │                                       │
│                                    ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database                          │   │
│  │  (users, transactions, budgets, pots, recurring_bills tables)  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract the data access layer to decouple business logic from database operations.

**Implementation**:
```
┌─────────────────────┐       ┌─────────────────────┐
│   Service Layer      │──────▶│   Repository Layer   │
│  (Business Logic)    │       │ (Data Access Logic)  │
└─────────────────────┘       └─────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │    Database (DB)     │
                                └─────────────────────┘
```

**Benefits**:
- Separation of concerns
- Easy to test (mock repositories)
- Easy to switch databases
- Cleaner business logic

**Example**:
```python
# Repository (app/repositories/transaction_repository.py)
class TransactionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_transactions(self, user_id: int, skip: int = 0, limit: int = 10):
        # Database operations here
        result = await self.db.execute(...)
        return result.scalars().all()

# Service (app/services/transaction_service.py)
class TransactionService:
    def __init__(self, db: AsyncSession):
        self.transaction_repo = TransactionRepository(db)
    
    async def get_transactions(self, user_id: int, skip: int = 0, limit: int = 10):
        # Business logic here
        transactions = await self.transaction_repo.get_transactions(user_id, skip, limit)
        # Transform, calculate, etc.
        return {"items": transactions, "total": len(transactions)}
```

### 2. Service Pattern

**Purpose**: Encapsulate business logic and coordinate between multiple repositories.

**Implementation**:
- Each domain entity (User, Transaction, Budget, etc.) has its own service
- Services handle business rules and validation
- Services use repositories for data access

**Example**:
```python
# app/services/transaction_service.py
class TransactionService:
    def __init__(self, db: AsyncSession):
        self.transaction_repo = TransactionRepository(db)
        self.budget_repo = BudgetRepository(db)  # Can use multiple repos
    
    async def create_transaction(self, user_id: int, transaction_create: TransactionCreate):
        # Business logic: create transaction AND update budget
        transaction = await self.transaction_repo.create_transaction(...)
        
        if transaction.type == "expense":
            # Update budget spent amount
            await self.budget_repo.update_spent_amount(
                user_id, transaction.category, transaction.amount
            )
        
        return transaction
```

### 3. Dependency Injection Pattern

**Purpose**: Provide dependencies (like database sessions) to components without hardcoding them.

**Implementation**:
- FastAPI's built-in dependency injection system
- Database session injected via `Depends(get_db)`
- User authentication injected via `Depends(get_current_user)`

**Example**:
```python
# Route handler (app/api/v1/routes/transactions.py)
@router.get("")
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    user_id: str = Depends(get_current_user),  # Injected
    db: AsyncSession = Depends(get_db),         # Injected
):
    service = TransactionService(db)  # Service receives injected db
    return await service.get_transactions(int(user_id), skip, limit)
```

### 4. Unit of Work Pattern (Partial)

**Purpose**: Manage database transactions as a single unit of work.

**Implementation**:
- SQLAlchemy's session acts as a unit of work
- All operations within a request share the same session
- `commit()` persists all changes
- `rollback()` on errors

**Note**: The application could be enhanced with a more explicit Unit of Work pattern for complex transactions.

---

## 3. Layered Architecture

### Layer 1: Presentation Layer (API Routes)

**Location**: `app/api/v1/routes/`

**Responsibilities**:
- Define HTTP endpoints (GET, POST, PUT, DELETE, PATCH)
- Handle request/response formatting
- Validate request parameters (using Pydantic)
- Handle HTTP-specific concerns (status codes, headers)
- Authenticate and authorize requests
- Delegate business logic to services

**Files**:
- `auth.py` - Authentication endpoints
- `transactions.py` - Transaction management
- `budgets.py` - Budget management
- `pots.py` - Savings pots management
- `dashboard.py` - Dashboard data

**Code Pattern**:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.xxx_service import XxxService
from app.schemas.xxx import XxxResponse

router = APIRouter(prefix="/xxx", tags=["xxx"])

@router.get("", response_model=list[XxxResponse])
async def get_all(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = XxxService(db)
    return await service.get_all(int(user_id))
```

### Layer 2: Application Layer (Services)

**Location**: `app/services/`

**Responsibilities**:
- Implement business logic
- Coordinate between multiple repositories
- Apply business rules and validation
- Transform data between models and schemas
- Handle complex operations that span multiple entities

**Files**:
- `auth_service.py` - User authentication logic
- `transaction_service.py` - Transaction business logic
- `budget_service.py` - Budget business logic
- `pot_service.py` - Savings pots business logic
- `dashboard_service.py` - Dashboard data aggregation

**Code Pattern**:
```python
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.xxx_repository import XxxRepository

class XxxService:
    def __init__(self, db: AsyncSession):
        self.xxx_repo = XxxRepository(db)
        # Can have multiple repositories
    
    async def get_all(self, user_id: int):
        # Business logic here
        items = await self.xxx_repo.get_all(user_id)
        # Apply transformations, calculations, etc.
        return items
```

### Layer 3: Domain Layer (Repositories & Models)

**Location**: 
- `app/repositories/` - Repositories
- `app/models/` - SQLAlchemy models

**Responsibilities**:
- **Repositories**: Data access operations (CRUD)
- **Models**: Database schema definitions
- Define entity relationships
- Handle database-specific operations

**Files**:
- `repositories/user_repository.py` - User data access
- `repositories/transaction_repository.py` - Transaction data access
- `models/user.py` - User model
- `models/transaction.py` - Transaction model
- etc.

**Repository Code Pattern**:
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.xxx import Xxx

class XxxRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_all(self, user_id: int):
        result = await self.db.execute(
            select(Xxx).where(Xxx.user_id == user_id)
        )
        return result.scalars().all()
    
    async def get_by_id(self, id: int, user_id: int):
        result = await self.db.execute(
            select(Xxx).where(Xxx.id == id, Xxx.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def create(self, **kwargs):
        entity = Xxx(**kwargs)
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity
```

**Model Code Pattern**:
```python
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from app.core.database import Base

class Xxx(Base):
    __tablename__ = "xxx"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    # other fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### Layer 4: Infrastructure Layer (Core & Database)

**Location**: `app/core/`

**Responsibilities**:
- Application configuration
- Database connection management
- Security (authentication, password hashing)
- Constants and enums
- Cross-cutting concerns

**Files**:
- `config.py` - Application settings
- `database.py` - Database connection and session management
- `security.py` - Authentication and password hashing
- `constants.py` - Enums and constants

**Code Pattern**:
```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Finance App"
    DATABASE_URL: str = "..."
    SECRET_KEY: str = "..."
    # ...

settings = Settings()

# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine(settings.DATABASE_URL, ...)
AsyncSessionLocal = async_sessionmaker(engine, ...)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

### Layer 5: Interface Layer (Schemas)

**Location**: `app/schemas/`

**Responsibilities**:
- Define data transfer objects (DTOs)
- Request/response validation
- Data serialization/deserialization
- Type safety for API contracts

**Files**:
- `user.py` - User-related schemas
- `transaction.py` - Transaction-related schemas
- `budget.py` - Budget-related schemas
- `pot.py` - Pot-related schemas
- `recurring_bill.py` - Recurring bill schemas

**Code Pattern**:
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class XxxBase(BaseModel):
    field1: str
    field2: float

class XxxCreate(XxxBase):
    # Additional fields for creation
    pass

class XxxUpdate(BaseModel):
    field1: Optional[str] = None
    field2: Optional[float] = None

class XxxResponse(XxxBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

---

## 4. Request Flow

### Complete Request-Response Cycle

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │────▶│  Load   │────▶│  Route  │────▶│ Service │
│ (Browser)│     │ Balancer│     │ Handler │     │  Layer  │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                    │
                                                    ▼
                                                   ┌─────────┐
                                                   │Repository│
                                                   └────┬────┘
                                                        │
                                                        ▼
                                                   ┌─────────┐
                                                   │ Database│
                                                   └─────────┘
```

### Detailed Flow with Example (GET /api/v1/transactions)

```
1. Client sends HTTP GET request to /api/v1/transactions
   └── Headers: Authorization: Bearer <token>

2. FastAPI receives request
   └── Routes to: app/api/v1/routes/transactions.py:get_transactions()

3. Dependency Injection
   ├── get_current_user() extracts user_id from JWT token
   │   └── Uses app/core/security.py:get_current_user()
   │       └── Decodes JWT using python-jose
   └── get_db() provides AsyncSession
       └── Uses app/core/database.py:get_db()
           └── Creates session from async_sessionmaker

4. Route Handler Execution
   └── transactions.py:get_transactions()
       ├── Validates query parameters (skip, limit)
       └── Creates TransactionService(db)

5. Service Layer
   └── transaction_service.py:get_transactions()
       ├── Creates TransactionRepository(db)
       └── Calls transaction_repo.get_transactions(user_id, skip, limit)

6. Repository Layer
   └── transaction_repository.py:get_transactions()
       ├── Builds SQL query: SELECT * FROM transactions WHERE user_id = ?
       │   ORDER BY transaction_date DESC LIMIT ? OFFSET ?
       ├── Executes: await self.db.execute(query)
       └── Returns: List[Transaction] objects

7. Data Transformation
   └── Service transforms SQLAlchemy models to Pydantic responses
       └── Returns: {"items": [...], "total": N, "skip": 0, "limit": 10}

8. Response
   └── FastAPI serializes response to JSON
       └── Returns HTTP 200 with JSON body
```

### Authentication Flow (POST /api/v1/auth/login)

```
1. Client sends HTTP POST to /api/v1/auth/login
   └── Body: username=email@example.com&password=secret123
   └── Content-Type: application/x-www-form-urlencoded

2. FastAPI receives request
   └── Routes to: app/api/v1/routes/auth.py:login()

3. Request Parsing
   └── Uses OAuth2PasswordRequestForm dependency
       └── Extracts username and password from form data

4. Service Layer
   └── auth_service.py:login_user(email, password)
       ├── user_repo.get_user_by_email(email)
       │   └── Queries: SELECT * FROM users WHERE email = ?
       ├── If user not found: return None
       ├── verify_password(password, user.hashed_password)
       │   └── Uses passlib.bcrypt to verify hash
       │   └── If mismatch: return None
       └── create_access_token(data={"sub": str(user.id)})
           └── Uses python-jose to create JWT
           └── Expires in 30 minutes (configurable)

5. Response
   ├── If successful: {"access_token": "...", "token_type": "bearer"}
   └── If failed: HTTP 401 Unauthorized
```

---

## 5. Dependency Injection

### FastAPI's Dependency Injection System

FastAPI provides a powerful dependency injection system that is used extensively throughout the application.

**Key Dependencies**:

1. **Database Session (`get_db`)**
   ```python
   # app/core/database.py
   async def get_db():
       async with AsyncSessionLocal() as session:
           yield session
   
   # Usage in routes
   @router.get("/transactions")
   async def get_transactions(
       db: AsyncSession = Depends(get_db)
   ):
       # db is automatically injected
   ```

2. **Current User (`get_current_user`)**
   ```python
   # app/core/security.py
   async def get_current_user(token: str = Depends(oauth2_scheme)):
       # Decode JWT and return user_id
       return user_id
   
   # Usage in routes
   @router.get("/me")
   async def get_me(
       user_id: str = Depends(get_current_user)
   ):
       # user_id is automatically extracted from token
   ```

3. **Query Parameters**
   ```python
   @router.get("/transactions")
   async def get_transactions(
       skip: int = Query(0, ge=0),        # Validated query param
       limit: int = Query(10, ge=1, le=100)  # Validated query param
   ):
       # skip and limit are automatically validated
   ```

### Dependency Chain

```
Request
  │
  ▼
┌─────────────────────┐
│  Route Handler       │◀────┐
│  (transactions.py)    │     │
└─────────┬───────────┘     │
          │                 │
          ▼                 │
┌─────────────────────┐     │
│  Dependencies        │     │
│  - get_db()          │─────┘
│  - get_current_user()│
│  - Query parameters  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Service Layer       │
│  (transaction_service)│
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Repository Layer    │
│  (transaction_repo) │
└─────────────────────┘
```

### Benefits of Dependency Injection

1. **Testability**: Easy to mock dependencies for testing
2. **Reusability**: Same dependencies can be reused across routes
3. **Maintainability**: Clear separation of concerns
4. **Flexibility**: Easy to swap implementations
5. **Clean Code**: Reduces boilerplate

---

## 6. Async Architecture

### Why Async?

1. **Performance**: Can handle multiple requests concurrently
2. **Database Efficiency**: Async database operations don't block the event loop
3. **Scalability**: Can serve more concurrent users with fewer resources
4. **Modern Standard**: Async/await is the future of Python web development

### Async Stack

```
┌─────────────────────┐
│   FastAPI (ASGI)     │  ← Async-first framework
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   SQLAlchemy 2.0+   │  ← Async ORM
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    asyncpg 0.29+    │  ← Async PostgreSQL driver
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   PostgreSQL 16+     │  ← Database server
└─────────────────────┘
```

### Async Code Patterns

**1. Route Handlers**
```python
@router.get("/transactions")
async def get_transactions(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # async function
    service = TransactionService(db)
    return await service.get_transactions(int(user_id))  # await service call
```

**2. Service Methods**
```python
class TransactionService:
    async def get_transactions(self, user_id: int):
        # async method
        transactions = await self.transaction_repo.get_transactions(user_id)
        return transactions
```

**3. Repository Methods**
```python
class TransactionRepository:
    async def get_transactions(self, user_id: int):
        # async database operation
        result = await self.db.execute(
            select(Transaction).where(Transaction.user_id == user_id)
        )
        return result.scalars().all()
```

**4. Database Operations**
```python
# All SQLAlchemy operations are awaited
async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)

async with AsyncSessionLocal() as session:
    yield session  # Used in get_db()
```

### Async Context Managers

```python
# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    print("Shutdown")

# Database session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

### Key Async Features Used

1. **`async def`**: Define async functions
2. **`await`**: Wait for async operations to complete
3. **`AsyncSession`**: SQLAlchemy async session
4. **`async with`**: Async context managers
5. **`async for`**: Async iteration (not used but available)
6. **`asyncio`**: Async I/O library (used by FastAPI/uvicorn)

---

## Summary

The Finance App Backend follows a clean, modern architecture with:

1. **Layered Architecture**: Clear separation between presentation, application, domain, and infrastructure layers
2. **Repository Pattern**: Decouples business logic from data access
3. **Service Pattern**: Encapsulates business logic and coordinates repositories
4. **Dependency Injection**: Provides dependencies cleanly and enables testability
5. **Async-First**: Built with async/await for optimal performance

This architecture makes the application:
- **Maintainable**: Easy to understand and modify
- **Testable**: Easy to write unit and integration tests
- **Scalable**: Can handle increased load
- **Extensible**: Easy to add new features
- **Production-Ready**: Follows best practices

---

*Documentation for Finance App Backend v1.0.0*
