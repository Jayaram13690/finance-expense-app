from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)

    async def register_user(self, user_create: UserCreate):
        # Check if user already exists
        existing_user = await self.user_repo.get_user_by_email(user_create.email)
        if existing_user:
            return None

        # Hash password and create user
        hashed_password = get_password_hash(user_create.password)
        user = await self.user_repo.create_user(
            name=user_create.name,
            email=user_create.email,
            hashed_password=hashed_password,
        )
        return user

    async def login_user(self, email: str, password: str):
        user = await self.user_repo.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None

        # Generate JWT token
        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer", "user": user}

    async def get_user(self, user_id: int):
        return await self.user_repo.get_user_by_id(user_id)
