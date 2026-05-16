from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.pot import Pot


class PotRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_pots(self, user_id: int):
        result = await self.db.execute(
            select(Pot).where(Pot.user_id == user_id)
        )
        return result.scalars().all()

    async def get_pot_by_id(self, pot_id: int, user_id: int) -> Pot:
        result = await self.db.execute(
            select(Pot).where(Pot.id == pot_id, Pot.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create_pot(
        self,
        user_id: int,
        name: str,
        target_amount: float,
        theme_color: str = "blue",
    ) -> Pot:
        pot = Pot(
            user_id=user_id,
            name=name,
            target_amount=target_amount,
            theme_color=theme_color,
        )
        self.db.add(pot)
        await self.db.commit()
        await self.db.refresh(pot)
        return pot

    async def update_pot(self, pot_id: int, user_id: int, **kwargs) -> Pot:
        pot = await self.get_pot_by_id(pot_id, user_id)
        if pot:
            for key, value in kwargs.items():
                if value is not None:
                    setattr(pot, key, value)
            await self.db.commit()
            await self.db.refresh(pot)
        return pot

    async def delete_pot(self, pot_id: int, user_id: int) -> bool:
        pot = await self.get_pot_by_id(pot_id, user_id)
        if pot:
            await self.db.delete(pot)
            await self.db.commit()
            return True
        return False

    async def deposit(self, pot_id: int, user_id: int, amount: float) -> Pot:
        pot = await self.get_pot_by_id(pot_id, user_id)
        if pot:
            pot.current_amount += amount
            await self.db.commit()
            await self.db.refresh(pot)
        return pot

    async def withdraw(self, pot_id: int, user_id: int, amount: float) -> Pot:
        pot = await self.get_pot_by_id(pot_id, user_id)
        if pot and pot.current_amount >= amount:
            pot.current_amount -= amount
            await self.db.commit()
            await self.db.refresh(pot)
        return pot
