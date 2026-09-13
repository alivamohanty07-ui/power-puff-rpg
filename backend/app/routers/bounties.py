from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/bounties", tags=["Guild Bounties"])

DEFAULT_BOUNTIES = [
    {
        "id": 1,
        "title": "Bounty: Morning Procrastination Specter",
        "description": "Slay your toughest task before 11:00 AM.",
        "target_house": "House Buttercup",
        "bounty_type": "Daily Grit",
        "xp_reward": 120,
        "gold_reward": 100,
        "is_claimed": False
    },
    {
        "id": 2,
        "title": "Bounty: Codebase Fortification Raid",
        "description": "Complete 3 Pomodoro sprints with zero browser tab distractions.",
        "target_house": "House Blossom",
        "bounty_type": "Deep Focus",
        "xp_reward": 150,
        "gold_reward": 120,
        "is_claimed": False
    },
    {
        "id": 3,
        "title": "Bounty: Radiant Sanctuary Recharge",
        "description": "Log 8 hours of restorative sleep and hit 2L hydration goal.",
        "target_house": "House Bubbles",
        "bounty_type": "Vitality Ritual",
        "xp_reward": 100,
        "gold_reward": 80,
        "is_claimed": False
    }
]

@router.get("", response_model=List[schemas.BountyOut])
def get_bounties(db: Session = Depends(get_db)):
    """
    Retrieve available guild bounties.
    """
    db_bounties = db.query(models.Bounty).all()
    if not db_bounties:
        for b in DEFAULT_BOUNTIES:
            bounty = models.Bounty(
                id=b["id"],
                title=b["title"],
                description=b["description"],
                target_house=b["target_house"],
                bounty_type=b["bounty_type"],
                xp_reward=b["xp_reward"],
                gold_reward=b["gold_reward"],
                is_claimed=False
            )
            db.add(bounty)
        db.commit()
        db_bounties = db.query(models.Bounty).all()

    return db_bounties


@router.post("/{bounty_id}/claim")
def claim_bounty(
    bounty_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Claim a guild bounty reward for the current adventurer.
    """
    bounty = db.query(models.Bounty).filter(models.Bounty.id == bounty_id).first()
    if not bounty:
        b = next((x for x in DEFAULT_BOUNTIES if x["id"] == bounty_id), None)
        if not b:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bounty not found")
        xp_gain = b["xp_reward"]
        gold_gain = b["gold_reward"]
    else:
        if bounty.is_claimed:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bounty already claimed today!")
        bounty.is_claimed = True
        xp_gain = bounty.xp_reward
        gold_gain = bounty.gold_reward

    current_user.xp += xp_gain
    current_user.gold += gold_gain
    current_user.level = 1 + (current_user.xp // 100)

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Bounty claimed successfully! Gold and XP added.",
        "xp_awarded": xp_gain,
        "gold_awarded": gold_gain,
        "current_level": current_user.level,
        "total_gold": current_user.gold
    }
