from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.models.transaction import Transaction


class TransactionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_transactions(self, user_id: int, skip: int = 0, limit: int = 10):
        result = await self.db.execute(
            select(Transaction)
            .where(Transaction.user_id == user_id)
            .order_by(desc(Transaction.transaction_date))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_transactions_count(self, user_id: int) -> int:
        result = await self.db.execute(
            select(Transaction).where(Transaction.user_id == user_id)
        )
        return len(result.scalars().all())

    async def get_transaction_by_id(self, transaction_id: int, user_id: int) -> Transaction:
        result = await self.db.execute(
            select(Transaction).where(
                Transaction.id == transaction_id, Transaction.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def create_transaction(
        self,
        user_id: int,
        title: str,
        amount: float,
        type: str,
        category: str,
        description: str = None,
        transaction_date = None,
    ) -> Transaction:
        transaction = Transaction(
            user_id=user_id,
            title=title,
            amount=amount,
            type=type,
            category=category,
            description=description,
            transaction_date=transaction_date,
        )
        self.db.add(transaction)
        await self.db.commit()
        await self.db.refresh(transaction)
        return transaction

    async def update_transaction(
        self, transaction_id: int, user_id: int, **kwargs
    ) -> Transaction:
        transaction = await self.get_transaction_by_id(transaction_id, user_id)
        if transaction:
            for key, value in kwargs.items():
                if value is not None:
                    setattr(transaction, key, value)
            await self.db.commit()
            await self.db.refresh(transaction)
        return transaction

    async def delete_transaction(self, transaction_id: int, user_id: int) -> bool:
        transaction = await self.get_transaction_by_id(transaction_id, user_id)
        if transaction:
            await self.db.delete(transaction)
            await self.db.commit()
            return True
        return False
