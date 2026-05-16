from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.budget import Budget


class BudgetRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_budgets(self, user_id: int):
        result = await self.db.execute(
            select(Budget).where(Budget.user_id == user_id)
        )
        return result.scalars().all()

    async def get_budget_by_id(self, budget_id: int, user_id: int) -> Budget:
        result = await self.db.execute(
            select(Budget).where(Budget.id == budget_id, Budget.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create_budget(
        self,
        user_id: int,
        category: str,
        limit_amount: float,
        month: int,
        year: int,
    ) -> Budget:
        budget = Budget(
            user_id=user_id,
            category=category,
            limit_amount=limit_amount,
            month=month,
            year=year,
        )
        self.db.add(budget)
        await self.db.commit()
        await self.db.refresh(budget)
        return budget

    async def update_budget(
        self, budget_id: int, user_id: int, **kwargs
    ) -> Budget:
        budget = await self.get_budget_by_id(budget_id, user_id)
        if budget:
            for key, value in kwargs.items():
                if value is not None:
                    setattr(budget, key, value)
            await self.db.commit()
            await self.db.refresh(budget)
        return budget

    async def delete_budget(self, budget_id: int, user_id: int) -> bool:
        budget = await self.get_budget_by_id(budget_id, user_id)
        if budget:
            await self.db.delete(budget)
            await self.db.commit()
            return True
        return False

    async def update_spent_amount(
        self, user_id: int, category: str, amount: float
    ) -> None:
        result = await self.db.execute(
            select(Budget).where(
                Budget.user_id == user_id, Budget.category == category
            )
        )
        budgets = result.scalars().all()
        for budget in budgets:
            budget.spent_amount += amount
        await self.db.commit()
