# Technology Stack & Libraries - Finance App Backend

## Table of Contents

1. [Core Framework](#1-core-framework)
2. [Database Layer](#2-database-layer)
3. [Authentication & Security](#3-authentication--security)
4. [Validation & Data Modeling](#4-validation--data-modeling)
5. [Development & Testing](#5-development--testing)
6. [HTTP & Networking](#6-http--networking)
7. [Dependencies Summary Table](#7-dependencies-summary-table)

---

## 1. Core Framework

### FastAPI (v0.104.1)

**What it is**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.

**Why it was chosen**:
- **Automatic API Documentation**: Built-in support for OpenAPI (Swagger) and ReDoc
- **Type Safety**: Uses Python type hints for data validation
- **Async Support**: Native async/await support for high performance
- **Dependency Injection**: Built-in DI system for clean code
- **Standards Compliant**: Follows API standards (OAuth2, JSON Schema)
- **Developer Experience**: Excellent editor support and easy to use

**How it's used in this application**:
```python
# app/main.py
from fastapi import FastAPI

app = FastAPI(
    title=settings.APP_NAME,
    description="A modern SaaS finance management backend",
    version="1.0.0",
    lifespan=lifespan,
)
```

**Key Features Utilized**:
- APIRouter for modular route organization
- Dependency injection for database sessions and authentication
- Query parameters with validation
- Request body validation via Pydantic models
- Automatic OpenAPI schema generation
- CORS middleware
- Exception handling

---

### Uvicorn (v0.24.0)

**What it is**: An ASGI server implementation for Python web applications, built on uvloop and httptools.

**Why it was chosen**:
- **ASGI Compliant**: Works perfectly with FastAPI (which is ASGI-based)
- **High Performance**: Built on uvloop (faster than standard asyncio)
- **Production Ready**: Used in production by many companies
- **Simple Configuration**: Easy to configure and run

**How it's used**:
```python
# app/main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
```

**Command Line Usage**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 2. Database Layer

### PostgreSQL

**What it is**: A powerful, open source object-relational database system with over 35 years of active development.

**Why it was chosen**:
- **Relational Database**: Perfect for structured financial data
- **ACID Compliant**: Ensures data integrity for financial transactions
- **Scalable**: Can handle large amounts of data efficiently
- **Extensible**: Supports custom functions, indexes, and data types
- **Production Ready**: Widely used in production environments

**How it's used**:
- Docker container (`postgres:16-alpine`) for development
- Configured via `DATABASE_URL` environment variable
- Format: `postgresql+asyncpg://user:password@host:port/database`

---

### SQLAlchemy (v2.0.23)

**What it is**: The Database Toolkit for Python. It's a Python SQL toolkit and Object-Relational Mapping (ORM) library.

**Why it was chosen**:
- **Industry Standard**: Most popular ORM for Python
- **Flexible**: Can use both ORM and raw SQL
- **Async Support**: SQLAlchemy 2.0+ has excellent async support
- **Database Agnostic**: Can switch databases with minimal code changes
- **Powerful Query Building**: Complex queries with a Pythonic API

**How it's used in this application**:

**Base Model Definition**:
```python
# app/core/database.py
from sqlalchemy.orm import declarative_base

Base = declarative_base()
```

**Async Engine**:
```python
# app/core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)
```

**Model Definition Example**:
```python
# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

---

### asyncpg (v0.29.0)

**What it is**: A database interface library for PostgreSQL. It is designed to be fast and work well with asyncio.

**Why it was chosen**:
- **PostgreSQL Native**: Specifically designed for PostgreSQL
- **Async First**: Built from the ground up for async
- **High Performance**: Among the fastest PostgreSQL clients for Python
- **Compatible**: Works seamlessly with SQLAlchemy's async features

**How it's used**:
- Used as the driver in SQLAlchemy's async engine
- Connection URL format: `postgresql+asyncpg://...`

---

### Alembic (v1.13.1)

**What it is**: A lightweight database migration tool for usage with SQLAlchemy.

**Why it was chosen**:
- **Standard Tool**: The most popular migration tool for SQLAlchemy
- **Version Control**: Tracks database schema changes over time
- **Flexible**: Supports complex migration scenarios
- **Integrated**: Works seamlessly with SQLAlchemy models

**Note**: While Alembic is in `requirements.txt`, it's currently not fully configured in the project. The application creates tables on startup using SQLAlchemy's `create_all()` method.

---

## 3. Authentication & Security

### python-jose (v3.3.0) with cryptography

**What it is**: A JWT (JSON Web Token) implementation in Python using the jose library.

**Why it was chosen**:
- **JWT Standard**: Implements RFC 7519 (JWT standard)
- **Secure**: Uses cryptography library for signing
- **Lightweight**: Simple and focused on JWT operations
- **Well Maintained**: Actively maintained and widely used

**How it's used**:
```python
# app/core/security.py
from jose import JWTError, jwt

# Create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Verify JWT token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credential_exception
    except JWTError:
        raise credential_exception
    return user_id
```

---

### Passlib (v1.7.4) with bcrypt

**What it is**: A password hashing library for Python. Passlib is a comprehensive password hashing framework supporting over 30 schemes, including bcrypt.

**Why it was chosen**:
- **Secure Hashing**: bcrypt is a secure password hashing algorithm
- **Battle Tested**: Widely used in production
- **Flexible**: Supports multiple hashing algorithms
- **Easy to Use**: Simple API for hashing and verification

**How it's used**:
```python
# app/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

---

### bcrypt (v3.2.2)

**What it is**: A direct bcrypt implementation for Python.

**Why it was chosen**:
- **Required by Passlib**: Passlib's bcrypt support requires this package
- **Performance**: C-based implementation for better performance
- **Security**: Properly implements the bcrypt algorithm

---

## 4. Validation & Data Modeling

### Pydantic (v2.5.0)

**What it is**: Data validation and settings management using Python type annotations. Pydantic enforces type hints at runtime and provides user-friendly errors when data is invalid.

**Why it was chosen**:
- **Type Safety**: Validates data based on Python type hints
- **FastAPI Integration**: FastAPI uses Pydantic for request/response validation
- **Flexible**: Supports complex validation rules
- **Performance**: Pydantic v2 is significantly faster than v1
- **Data Serialization**: Easy conversion between Python objects and JSON

**How it's used**:

**Schema Definition**:
```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

**Request Validation**:
```python
# app/api/v1/routes/auth.py
@router.post("/register", response_model=UserResponse)
async def register(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    # user_create is automatically validated by FastAPI using Pydantic
    auth_service = AuthService(db)
    user = await auth_service.register_user(user_create)
    return user
```

---

### Pydantic Settings (v2.1.0)

**What it is**: Settings management for Pydantic. Provides a way to load configuration from environment variables or files.

**Why it was chosen**:
- **Type Safe**: Configuration values are type-checked
- **Environment Variables**: Automatically loads from `.env` files and environment variables
- **Hierarchical**: Supports nested configuration structures
- **Validation**: Validates configuration on load

**How it's used**:
```python
# app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Finance App"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/finance_db"
    
    # JWT
    SECRET_KEY: str = "1b4a203b456c442f675d4aff5681b3cd1ecc6fe1902b84c7b78ea304b7b98f3b"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

### email-validator (v2.1.0)

**What it is**: A library for validating email addresses. It's used by Pydantic's `EmailStr` type.

**Why it was chosen**:
- **RFC Compliant**: Validates emails according to RFC standards
- **Fast**: Written in C for performance
- **Integration**: Works seamlessly with Pydantic

---

## 5. Development & Testing

### pytest (v7.4.3)

**What it is**: A mature Python testing framework that makes it easy to write small tests, yet scales to support complex functional testing.

**Why it was chosen**:
- **Standard**: The most popular testing framework for Python
- **Flexible**: Supports various testing styles
- **Rich Features**: Fixtures, parameterization, markers, etc.
- **Async Support**: Supports async tests via pytest-asyncio

**How it's used**:
```python
# tests/test_auth.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.fixture
async def test_db():
    # Setup test database
    engine = create_async_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # ...
    yield
    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_register_user(test_db):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "testpassword123",
            },
        )
        assert response.status_code == 200
```

---

## 6. HTTP & Networking

### httpx (v0.25.2)

**What it is**: A fully featured HTTP client for Python 3, with support for both synchronous and asynchronous requests.

**Why it was chosen**:
- **Async Support**: Fully supports async/await
- **Modern API**: Clean, intuitive API
- **Feature Rich**: Supports HTTP/2, proxies, timeouts, etc.
- **Testing**: Can be used for testing FastAPI applications
- **Type Annotations**: Full type hint support

**How it's used**:
- As the HTTP client for testing in pytest
- For making HTTP requests to the FastAPI application in tests

```python
# tests/test_auth.py
from httpx import AsyncClient

async with AsyncClient(app=app, base_url="http://test") as client:
    response = await client.post("/api/v1/auth/register", json={...})
```

---

### python-multipart (v0.0.6)

**What it is**: A streaming multipart parser for Python.

**Why it was chosen**:
- **Required by FastAPI**: Needed for form data parsing in FastAPI
- **Efficient**: Streaming parser for handling large file uploads
- **Compatibility**: Works well with FastAPI's form handling

**How it's used**:
- Used internally by FastAPI for handling form data (like login with username/password)

---

## 7. Dependencies Summary Table

| Package | Version | Purpose | Category | Why It's Important |
|---------|---------|---------|----------|-------------------|
| fastapi | 0.104.1 | Web framework | Framework | Core framework for building the API |
| uvicorn | 0.24.0 | ASGI server | Server | Production server for running the app |
| sqlalchemy | 2.0.23 | ORM | Database | Database interaction and ORM |
| asyncpg | 0.29.0 | PostgreSQL driver | Database | Async PostgreSQL connectivity |
| alembic | 1.13.1 | Database migrations | Database | Schema version control |
| pydantic | 2.5.0 | Data validation | Validation | Request/response data validation |
| pydantic-settings | 2.1.0 | Settings management | Configuration | Environment variable handling |
| python-jose | 3.3.0 | JWT encoding/decoding | Auth | Token creation and verification |
| passlib | 1.7.4 | Password hashing | Security | Secure password storage |
| bcrypt | 3.2.2 | Password hashing | Security | Low-level bcrypt implementation |
| email-validator | 2.1.0 | Email validation | Validation | Email address validation |
| pytest | 7.4.3 | Testing framework | Testing | Unit and integration testing |
| httpx | 0.25.2 | HTTP client | Testing | Testing HTTP requests |
| python-multipart | 0.0.6 | Form data parsing | HTTP | Form data handling |

---

## Library Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Finance App Backend                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │   FastAPI   │────▶│  Pydantic   │     │  Uvicorn    │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
│         │                   │                       │             │
│         ▼                   ▼                       ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Request/Response Cycle                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                                 │
│         ▼                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │ SQLAlchemy  │◀───▶│ asyncpg     │◀───▶│ PostgreSQL  │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
│         │                                                           │
│         ▼                                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Business Logic Layer                     │   │
│  │  (Services, Repositories, Models)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                           │
│         ▼                                                           │
│  ┌─────────────┐     ┌─────────────┐                             │
│  │ python-jose │     │  Passlib    │                             │
│  └─────────────┘     └─────────────┘                             │
│         │                   │                                       │
│         └───────────────────┴───────────────────┐                │
│                         │                        │                │
│                    JWT Tokens                Password Hashing      │
│                                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

The Finance App Backend uses a carefully selected set of modern, production-ready Python libraries that work together seamlessly:

1. **FastAPI + Uvicorn**: High-performance web server and framework
2. **SQLAlchemy + asyncpg + PostgreSQL**: Robust async database layer
3. **Pydantic**: Type-safe data validation and configuration
4. **python-jose + Passlib**: Secure authentication and authorization
5. **pytest + httpx**: Comprehensive testing framework

Each library was chosen for its:
- **Production readiness**
- **Active maintenance**
- **Performance characteristics**
- **Compatibility with other libraries**
- **Developer experience**

The combination provides a solid foundation for a scalable, maintainable, and secure finance management backend.

---

*Documentation for Finance App Backend v1.0.0*
