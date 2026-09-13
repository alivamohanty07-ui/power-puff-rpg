from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/quests", tags=["Quests & Tasks"])

DEFAULT_STARTER_QUESTS = [
    {
        "id": 1,
        "title": "Deep Work Sprint: Banish Procrastination",
        "description": "25-minute focused sprint without notifications or distraction.",
        "map_location": "Town Square",
        "difficulty": "Medium",
        "attribute": "Intellect",
        "xp_reward": 60,
        "gold_reward": 35
    },
    {
        "id": 2,
        "title": "Physical Armor Conditioning (30m Workout)",
        "description": "Engage in physical resistance or high-intensity body workout.",
        "map_location": "Town Square",
        "difficulty": "Hard",
        "attribute": "Strength",
        "xp_reward": 75,
        "gold_reward": 40
    },
    {
        "id": 3,
        "title": "Hydration & Mindful Recharge Ritual",
        "description": "Drink 500ml water, stretch spine, and breathe deeply.",
        "map_location": "Blossom Sanctuary",
        "difficulty": "Easy",
        "attribute": "Vitality",
        "xp_reward": 40,
        "gold_reward": 20
    },
    {
        "id": 4,
        "title": "Refactor Legacy Code / Polish Architecture",
        "description": "Confront the most formidable boss engineering quest of the day.",
        "map_location": "Neon Citadel",
        "difficulty": "Boss",
        "attribute": "Intellect",
        "xp_reward": 90,
        "gold_reward": 50
    }
]

@router.get("", response_model=List[schemas.QuestOut])
def get_quests(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(lambda: None)
):
    """
    Retrieve all active quests. If user has custom quests in DB, return them.
    Otherwise return starter RPG quests.
    """
    db_quests = db.query(models.Task).all()
    if not db_quests:
        # Seed starter quests with a placeholder/first user or return default list
        first_user = db.query(models.User).first()
        if first_user:
            for sq in DEFAULT_STARTER_QUESTS:
                quest = models.Task(
                    user_id=first_user.id,
                    title=sq["title"],
                    description=sq["description"],
                    map_location=sq["map_location"],
                    difficulty=sq["difficulty"],
                    attribute=sq["attribute"],
                    xp_reward=sq["xp_reward"],
                    gold_reward=sq["gold_reward"],
                    is_completed=False
                )
                db.add(quest)
            db.commit()
            db_quests = db.query(models.Task).all()
        else:
            # Synthetic response
            return [
                {
                    "id": sq["id"],
                    "user_id": 0,
                    "title": sq["title"],
                    "description": sq["description"],
                    "map_location": sq["map_location"],
                    "difficulty": sq["difficulty"],
                    "attribute": sq["attribute"],
                    "xp_reward": sq["xp_reward"],
                    "gold_reward": sq["gold_reward"],
                    "is_completed": False,
                    "created_at": None
                }
                for sq in DEFAULT_STARTER_QUESTS
            ]

    return db_quests


@router.post("", response_model=schemas.QuestOut, status_code=status.HTTP_201_CREATED)
def create_quest(
    quest_in: schemas.QuestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new quest / task for the authenticated adventurer.
    """
    db_quest = models.Task(
        user_id=current_user.id,
        title=quest_in.title,
        description=quest_in.description,
        map_location=quest_in.map_location,
        difficulty=quest_in.difficulty,
        attribute=quest_in.attribute,
        xp_reward=quest_in.xp_reward,
        gold_reward=quest_in.gold_reward,
        is_completed=False
    )
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    return db_quest


@router.post("/{quest_id}/complete")
def complete_quest(
    quest_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Mark a quest as completed, awarding XP and Gold bounties to the adventurer.
    """
    quest = db.query(models.Task).filter(models.Task.id == quest_id).first()
    if not quest:
        # Fallback to starter quest reward if not found in db
        sq = next((q for q in DEFAULT_STARTER_QUESTS if q["id"] == quest_id), None)
        xp_gain = sq["xp_reward"] if sq else 50
        gold_gain = sq["gold_reward"] if sq else 25
    else:
        quest.is_completed = True
        xp_gain = quest.xp_reward
        gold_gain = quest.gold_reward

    # Award stats to current user
    current_user.xp += xp_gain
    current_user.gold += gold_gain
    current_user.streak = (current_user.streak or 0) + 1

    # Check level up: 100 XP per level
    new_level = 1 + (current_user.xp // 100)
    leveled_up = new_level > current_user.level
    current_user.level = new_level

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Quest conquered!",
        "xp_awarded": xp_gain,
        "gold_awarded": gold_gain,
        "leveled_up": leveled_up,
        "current_level": current_user.level,
        "total_xp": current_user.xp,
        "total_gold": current_user.gold
    }


@router.delete("/{quest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quest(
    quest_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    quest = db.query(models.Task).filter(models.Task.id == quest_id, models.Task.user_id == current_user.id).first()
    if quest:
        db.delete(quest)
        db.commit()
    return None
