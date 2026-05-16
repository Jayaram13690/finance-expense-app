from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.pot_service import PotService
from app.schemas.pot import PotCreate, PotUpdate, PotDepositWithdraw, PotResponse

router = APIRouter(prefix="/pots", tags=["pots"])


@router.get("", response_model=list[PotResponse])
async def get_pots(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    return await service.get_pots(int(user_id))


@router.get("/{pot_id}", response_model=PotResponse)
async def get_pot(
    pot_id: int,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    pot = await service.get_pot(pot_id, int(user_id))
    if not pot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pot not found"
        )
    return pot


@router.post("", response_model=PotResponse)
async def create_pot(
    pot: PotCreate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    return await service.create_pot(
        int(user_id),
        name=pot.name,
        target_amount=pot.target_amount,
        theme_color=pot.theme_color,
    )


@router.put("/{pot_id}", response_model=PotResponse)
async def update_pot(
    pot_id: int,
    pot_update: PotUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    updated = await service.update_pot(
        pot_id, int(user_id), **pot_update.dict(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pot not found"
        )
    return updated


@router.patch("/{pot_id}/deposit", response_model=PotResponse)
async def deposit_to_pot(
    pot_id: int,
    deposit: PotDepositWithdraw,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    pot = await service.deposit(pot_id, int(user_id), deposit.amount)
    if not pot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deposit amount"
        )
    return pot


@router.patch("/{pot_id}/withdraw", response_model=PotResponse)
async def withdraw_from_pot(
    pot_id: int,
    withdraw: PotDepositWithdraw,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    pot = await service.withdraw(pot_id, int(user_id), withdraw.amount)
    if not pot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid withdrawal amount or insufficient balance",
        )
    return pot


@router.delete("/{pot_id}")
async def delete_pot(
    pot_id: int,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PotService(db)
    success = await service.delete_pot(pot_id, int(user_id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pot not found"
        )
    return {"message": "Pot deleted"}
