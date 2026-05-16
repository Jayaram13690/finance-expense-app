from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.budget_repository import BudgetRepository


class BudgetService:
    def __init__(self, db: AsyncSession):
        self.budget_repo = BudgetRepository(db)

    async def get_budgets(self, user_id: int):
        budgets = await self.budget_repo.get_budgets(user_id)
        return budgets

    async def get_budget(self, budget_id: int, user_id: int):
        return await self.budget_repo.get_budget_by_id(budget_id, user_id)

    async def create_budget(self, user_id: int, **kwargs):
        return await self.budget_repo.create_budget(user_id, **kwargs)

    async def update_budget(self, budget_id: int, user_id: int, **kwargs):
        return await self.budget_repo.update_budget(budget_id, user_id, **kwargs)

    async def delete_budget(self, budget_id: int, user_id: int):
        return await self.budget_repo.delete_budget(budget_id, user_id)
