from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.pot_repository import PotRepository


class PotService:
    def __init__(self, db: AsyncSession):
        self.pot_repo = PotRepository(db)

    async def get_pots(self, user_id: int):
        return await self.pot_repo.get_pots(user_id)

    async def get_pot(self, pot_id: int, user_id: int):
        return await self.pot_repo.get_pot_by_id(pot_id, user_id)

    async def create_pot(self, user_id: int, **kwargs):
        return await self.pot_repo.create_pot(user_id, **kwargs)

    async def update_pot(self, pot_id: int, user_id: int, **kwargs):
        return await self.pot_repo.update_pot(pot_id, user_id, **kwargs)

    async def delete_pot(self, pot_id: int, user_id: int):
        return await self.pot_repo.delete_pot(pot_id, user_id)

    async def deposit(self, pot_id: int, user_id: int, amount: float):
        if amount <= 0:
            return None
        return await self.pot_repo.deposit(pot_id, user_id, amount)

    async def withdraw(self, pot_id: int, user_id: int, amount: float):
        pot = await self.pot_repo.get_pot_by_id(pot_id, user_id)
        if not pot or amount > pot.current_amount:
            return None
        return await self.pot_repo.withdraw(pot_id, user_id, amount)
