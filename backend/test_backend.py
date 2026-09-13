import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

def test_full_auth_and_models():
    # Ensure fresh test tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        data = res.json()
        assert data["status"] == "healthy"
        print("✓ Health check endpoint passed:", data)

        # 2. Signup & Register
        signup_payload = {
            "username": "BlossomHero",
            "email": "blossom@powerpuff.io",
            "password": "SecretPassword123!",
            "selected_theme": "cyberpunk-neon",
            "personality_house": "Blossom Leader",
            "guild_selection": "House Blossom",
            "character_avatar": "blossom_commander"
        }
        res = client.post("/api/auth/signup", json=signup_payload)
        assert res.status_code == 201, f"Signup failed: {res.text}"
        signup_data = res.json()
        assert "access_token" in signup_data
        token = signup_data["access_token"]
        user = signup_data["user"]
        assert user["username"] == "BlossomHero"
        assert user["level"] == 1
        assert user["gold"] == 100
        assert user["intellect"] == 10
        print("✓ Signup endpoint passed. User ID:", user["id"])

        # Test /api/auth/register with another user
        reg_payload = {
            "username": "ButtercupBrawler",
            "email": "buttercup@powerpuff.io",
            "password": "SecretPassword123!",
            "guild_selection": "House Buttercup"
        }
        reg_res = client.post("/api/auth/register", json=reg_payload)
        assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
        print("✓ Register endpoint (/api/auth/register) passed. User ID:", reg_res.json()["user"]["id"])

        # 3. Prevent duplicate signup
        res = client.post("/api/auth/signup", json=signup_payload)
        assert res.status_code == 400, "Duplicate signup should fail"
        print("✓ Duplicate signup rejection passed")

        # 4. Login with username
        login_res = client.post("/api/auth/login", json={
            "username_or_email": "BlossomHero",
            "password": "SecretPassword123!"
        })
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        login_data = login_res.json()
        assert "access_token" in login_data
        print("✓ Login endpoint with username passed")

        # 5. Login with email
        login_email_res = client.post("/api/auth/login", json={
            "username_or_email": "blossom@powerpuff.io",
            "password": "SecretPassword123!"
        })
        assert login_email_res.status_code == 200, f"Login with email failed: {login_email_res.text}"
        print("✓ Login endpoint with email passed")

        # 6. Current User Profile
        headers = {"Authorization": f"Bearer {token}"}
        me_res = client.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200, f"Get me failed: {me_res.text}"
        me_data = me_res.json()
        assert me_data["username"] == "BlossomHero"
        assert me_data["selected_theme"] == "cyberpunk-neon"
        print("✓ Get current user profile endpoint passed")

        # 7. Quests
        quests_res = client.get("/api/quests", headers=headers)
        assert quests_res.status_code == 200
        quests = quests_res.json()
        assert len(quests) >= 1
        print("✓ Get quests endpoint passed. Found:", len(quests), "quests")

        # Complete Quest
        complete_res = client.post(f"/api/quests/{quests[0]['id']}/complete", headers=headers)
        assert complete_res.status_code == 200
        assert complete_res.json()["success"] is True
        print("✓ Complete quest endpoint passed")

        # 8. Bounties
        bounties_res = client.get("/api/bounties", headers=headers)
        assert bounties_res.status_code == 200
        bounties = bounties_res.json()
        assert len(bounties) >= 1
        print("✓ Get bounties endpoint passed. Found:", len(bounties), "bounties")

        # 9. Character Stats
        char_res = client.get("/api/character/stats", headers=headers)
        assert char_res.status_code == 200
        char_data = char_res.json()
        assert "intellect" in char_data
        assert "maxXp" in char_data
        print("✓ Character stats endpoint (/api/character/stats) passed")

        # 10. Update Theme
        theme_res = client.patch("/api/auth/theme", json={"selected_theme": "cozy-pinkish"}, headers=headers)
        assert theme_res.status_code == 200
        assert theme_res.json()["selected_theme"] == "cozy-pinkish"
        print("✓ Theme update endpoint passed")

        # 11. Update Stats (simulate quest completion)
        stats_res = client.patch("/api/auth/stats", json={"xp_gain": 150, "gold_gain": 50}, headers=headers)
        assert stats_res.status_code == 200
        stats_data = stats_res.json()
        assert stats_data["xp"] > 100
        print("✓ RPG Stats progression endpoint passed")

    print("\nAll FastAPI backend tests passed successfully! 🎉")

if __name__ == "__main__":
    test_full_auth_and_models()
