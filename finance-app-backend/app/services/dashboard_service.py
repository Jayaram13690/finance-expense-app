from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.budget_repository import BudgetRepository
from app.repositories.pot_repository import PotRepository


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.transaction_repo = TransactionRepository(db)
        self.budget_repo = BudgetRepository(db)
        self.pot_repo = PotRepository(db)

    async def get_overview(self, user_id: int):
        # Get transactions
        all_transactions = await self.transaction_repo.get_transactions(
            user_id, skip=0, limit=1000
        )
        
        # Calculate totals
        total_income = sum(
            t.amount for t in all_transactions if t.type == "income"
        )
        total_expenses = sum(
            t.amount for t in all_transactions if t.type == "expense"
        )
        total_balance = total_income - total_expenses

        # Get latest 5 transactions
        latest_transactions = await self.transaction_repo.get_transactions(
            user_id, skip=0, limit=5
        )

        # Get budgets
        budgets = await self.budget_repo.get_budgets(user_id)

        # Get pots
        pots = await self.pot_repo.get_pots(user_id)
        total_pot_progress = sum(p.current_amount for p in pots)
        total_pot_target = sum(p.target_amount for p in pots)

        return {
            "total_balance": total_balance,
            "total_income": total_income,
            "total_expenses": total_expenses,
            "latest_transactions": latest_transactions,
            "budgets": budgets,
            "pots": pots,
            "pots_progress": {
                "current": total_pot_progress,
                "target": total_pot_target,
            },
        }
