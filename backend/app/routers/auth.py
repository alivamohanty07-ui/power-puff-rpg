from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app import models, schemas
from app.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
@router.post("/signup", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Create a new adventurer account and return JWT bearer token with user profile.
    """
    # Verify password confirmation if provided
    if user_in.confirm_password and user_in.password != user_in.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please verify your password."
        )

    # Check if username or email already taken
    existing_user = db.query(models.User).filter(
        or_(
            models.User.username == user_in.username,
            models.User.email == user_in.email
        )
    ).first()
    
    if existing_user:
        if existing_user.email.lower() == user_in.email.strip().lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An adventurer with this email is already registered."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This hero username is already taken. Please choose another."
            )

    # Hash password and initialize starter stats
    hashed_pwd = get_password_hash(user_in.password)
    db_user = models.User(
        username=user_in.username.strip(),
        email=user_in.email.strip().lower(),
        hashed_password=hashed_pwd,
        selected_theme=user_in.selected_theme or "dark-dungeon",
        personality_house=user_in.personality_house or "",
        character_avatar=user_in.character_avatar or "emily",
        has_completed_induction=False,
        level=1,
        xp=0,
        gold=100,
        streak=1,
        intellect=10,
        strength=10,
        vitality=10,
        mind=10
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Issue access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": str(db_user.id), "username": db_user.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": db_user
    }


@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user with username or email and return JWT bearer token.
    """
    identifier = (login_data.username_or_email or login_data.email or "").strip()
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide both email and password."
        )
    db_user = db.query(models.User).filter(
        or_(
            models.User.username == identifier,
            models.User.email == identifier.lower()
        )
    ).first()

    if not db_user or not verify_password(login_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your username/email and password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": str(db_user.id), "username": db_user.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": db_user
    }


@router.post("/logout")
def logout():
    """
    Logout endpoint for departing the realm cleanly.
    """
    return {
        "success": True,
        "message": "Successfully departed the realm gates. Safe travels!"
    }


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    """
    Retrieve profile and stats of the currently authenticated adventurer.
    """
    return current_user


@router.patch("/theme", response_model=schemas.UserOut)
def update_theme(
    theme_data: schemas.UserThemeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Persist selected visual theme to the user profile.
    """
    current_user.selected_theme = theme_data.selected_theme
    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/stats", response_model=schemas.UserOut)
def update_stats(
    stats_data: schemas.UserStatsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update XP, Gold, Level, or Streak for quest completions.
    """
    if stats_data.xp_gain:
        current_user.xp += stats_data.xp_gain
        # Calculate level progression: 100 XP per level
        calculated_level = 1 + (current_user.xp // 100)
        if calculated_level > current_user.level:
            current_user.level = calculated_level
            
    if stats_data.gold_gain:
        current_user.gold += stats_data.gold_gain

    if stats_data.streak is not None:
        current_user.streak = stats_data.streak

    if stats_data.intellect is not None:
        current_user.intellect = stats_data.intellect
    if stats_data.strength is not None:
        current_user.strength = stats_data.strength
    if stats_data.vitality is not None:
        current_user.vitality = stats_data.vitality
    if stats_data.mind is not None:
        current_user.mind = stats_data.mind

    db.commit()
    db.refresh(current_user)
    return current_user


CANONICAL_HOUSES = {
    "blossom": "House Blossom",
    "bubbles": "House Bubbles",
    "buttercup": "House Buttercup"
}

@router.post("/house", response_model=schemas.UserOut)
@router.patch("/house", response_model=schemas.UserOut)
def update_house(
    house_data: schemas.HouseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Persist attuned house from the House Induction ceremony to the authenticated user.
    """
    raw_house = house_data.houseId or house_data.house_id or house_data.house or house_data.houseName
    if not raw_house:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="House identifier is required."
        )

    clean_id = raw_house.strip().lower().replace("house ", "").strip()
    if clean_id not in CANONICAL_HOUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid house. Valid houses are blossom, bubbles, or buttercup."
        )

    canonical_name = CANONICAL_HOUSES[clean_id]
    current_user.personality_house = canonical_name
    current_user.has_completed_induction = True
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/house", response_model=schemas.HouseResponse)
def get_house(current_user: models.User = Depends(get_current_user)):
    """
    Retrieve saved house for the currently authenticated user.
    """
    if current_user.has_completed_induction and current_user.personality_house:
        clean_id = current_user.personality_house.strip().lower().replace("house ", "").strip()
        canonical_name = CANONICAL_HOUSES.get(clean_id, current_user.personality_house)
        return {
            "completed": True,
            "houseId": clean_id,
            "houseName": canonical_name,
            "selectedAt": current_user.updated_at or current_user.created_at
        }
    return {
        "completed": False,
        "houseId": None,
        "houseName": None,
        "selectedAt": None
    }


@router.patch("/avatar", response_model=schemas.UserOut)
def update_avatar(
    avatar_data: schemas.AvatarUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Persist customized avatar configuration from the Avatar Creator to the authenticated user.
    """
    import json
    current_user.avatar_config = json.dumps(avatar_data.avatar_data)
    if avatar_data.name:
        current_user.username = avatar_data.name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user

