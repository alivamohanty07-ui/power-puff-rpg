from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/character", tags=["Character & Stats"])

@router.get("/stats", response_model=schemas.CharacterStatsOut)
def get_character_stats(current_user: models.User = Depends(get_current_user)):
    """
    Retrieve core stats, attributes, and guild parameters for current adventurer.
    """
    max_xp = (current_user.level or 1) * 100
    return {
        "level": current_user.level,
        "xp": current_user.xp,
        "maxXp": max_xp,
        "gold": current_user.gold,
        "streak": current_user.streak,
        "intellect": current_user.intellect,
        "strength": current_user.strength,
        "vitality": current_user.vitality,
        "mind": current_user.mind,
        "personality_house": current_user.personality_house,
        "character_avatar": current_user.character_avatar,
        "selected_theme": current_user.selected_theme
    }

@router.patch("/stats", response_model=schemas.UserOut)
def update_character_stats(
    stats_in: schemas.UserStatsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update core attributes or award XP/Gold to the character.
    """
    if stats_in.xp_gain:
        current_user.xp += stats_in.xp_gain
        current_user.level = 1 + (current_user.xp // 100)

    if stats_in.gold_gain:
        current_user.gold += stats_in.gold_gain

    if stats_in.streak is not None:
        current_user.streak = stats_in.streak

    if stats_in.intellect is not None:
        current_user.intellect = stats_in.intellect
    if stats_in.strength is not None:
        current_user.strength = stats_in.strength
    if stats_in.vitality is not None:
        current_user.vitality = stats_in.vitality
    if stats_in.mind is not None:
        current_user.mind = stats_in.mind

    db.commit()
    db.refresh(current_user)
    return current_user
