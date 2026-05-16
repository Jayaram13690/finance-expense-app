from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.budget_repository import BudgetRepository
from app.schemas.transaction import TransactionCreate, TransactionResponse


class TransactionService:
    def __init__(self, db: AsyncSession):
        self.transaction_repo = TransactionRepository(db)
        self.budget_repo = BudgetRepository(db)

    async def get_transactions(self, user_id: int, skip: int = 0, limit: int = 10):
        transactions = await self.transaction_repo.get_transactions(user_id, skip, limit)
        total = await self.transaction_repo.get_transactions_count(user_id)
        return {
            "items": [TransactionResponse.model_validate(t) for t in transactions],
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    async def get_transaction(self, transaction_id: int, user_id: int):
        transaction = await self.transaction_repo.get_transaction_by_id(transaction_id, user_id)
        if transaction:
            return TransactionResponse.model_validate(transaction)
        return None

    async def create_transaction(
        self, user_id: int, transaction_create: TransactionCreate
    ):
        transaction = await self.transaction_repo.create_transaction(
            user_id=user_id,
            title=transaction_create.title,
            amount=transaction_create.amount,
            type=transaction_create.type,
            category=transaction_create.category if transaction_create.type == "expense" else None,
            description=transaction_create.description,
            transaction_date=transaction_create.transaction_date,
        )

        # Update budget spent amount if expense
        if transaction.type == "expense" and transaction.category:
            await self.budget_repo.update_spent_amount(
                user_id, transaction.category, transaction.amount
            )

        return TransactionResponse.model_validate(transaction)

    async def update_transaction(self, transaction_id: int, user_id: int, **kwargs):
        transaction = await self.transaction_repo.update_transaction(
            transaction_id, user_id, **kwargs
        )
        if transaction:
            return TransactionResponse.model_validate(transaction)
        return None

    async def delete_transaction(self, transaction_id: int, user_id: int):
        return await self.transaction_repo.delete_transaction(transaction_id, user_id)
