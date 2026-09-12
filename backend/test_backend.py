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

        # 2. Password mismatch rejection
        mismatch_res = client.post("/api/auth/signup", json={
            "username": "HeroMistake",
            "email": "mismatch@powerpuff.io",
            "password": "Password123!",
            "confirm_password": "WrongPassword456!"
        })
        assert mismatch_res.status_code == 400, "Password mismatch must be rejected"
        print("✓ Password mismatch rejection passed")

        # 3. Successful Signup
        signup_payload = {
            "username": "BlossomHero",
            "email": "blossom@powerpuff.io",
            "password": "SecretPassword123!",
            "confirm_password": "SecretPassword123!",
            "selected_theme": "cyberpunk-neon"
        }
        res = client.post("/api/auth/signup", json=signup_payload)
        assert res.status_code == 201, f"Signup failed: {res.text}"
        signup_data = res.json()
        assert "access_token" in signup_data
        token = signup_data["access_token"]
        user = signup_data["user"]
        assert user["username"] == "BlossomHero"
        assert user["has_completed_induction"] is False
        assert user["level"] == 1
        assert user["gold"] == 100
        assert user["intellect"] == 10
        print("✓ Signup endpoint passed. User ID:", user["id"])

        # 4. Prevent duplicate signup
        res = client.post("/api/auth/signup", json=signup_payload)
        assert res.status_code == 400, "Duplicate signup should fail"
        print("✓ Duplicate signup rejection passed")

        # 5. Invalid password on login
        bad_login_res = client.post("/api/auth/login", json={
            "username_or_email": "blossom@powerpuff.io",
            "password": "WrongPassword!"
        })
        assert bad_login_res.status_code == 401, "Invalid password must return 401"
        print("✓ Bad password rejection (401) passed")

        # 6. Login with email
        login_email_res = client.post("/api/auth/login", json={
            "username_or_email": "blossom@powerpuff.io",
            "password": "SecretPassword123!"
        })
        assert login_email_res.status_code == 200, f"Login with email failed: {login_email_res.text}"
        print("✓ Login endpoint with email passed")

        # 7. Login with username
        login_user_res = client.post("/api/auth/login", json={
            "username_or_email": "BlossomHero",
            "password": "SecretPassword123!"
        })
        assert login_user_res.status_code == 200, f"Login with username failed: {login_user_res.text}"
        print("✓ Login endpoint with username passed")

        # 8. Current User Profile
        headers = {"Authorization": f"Bearer {token}"}
        me_res = client.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200, f"Get me failed: {me_res.text}"
        me_data = me_res.json()
        assert me_data["username"] == "BlossomHero"
        assert me_data["has_completed_induction"] is False
        print("✓ Get current user profile endpoint passed")

        # 9. Attune House (Simulate House Induction Completion)
        house_res = client.patch("/api/auth/house", json={
            "house": "House Blossom",
            "house_id": "blossom",
            "scores": {"blossom": 4, "bubbles": 1, "buttercup": 0}
        }, headers=headers)
        assert house_res.status_code == 200
        house_data = house_res.json()
        assert house_data["personality_house"] == "House Blossom"
        assert house_data["has_completed_induction"] is True
        print("✓ House attunement update passed (has_completed_induction=True)")

        # 10. Save Avatar (Simulate Avatar Customization Completion)
        avatar_payload = {
            "avatar_data": {
                "base": "female",
                "name": "Lydia",
                "skinTone": "porcelain",
                "hairstyle": "twin-tails",
                "hairColor": "pastel-rose",
                "outfit": "academy-uniform",
                "hairAccessory": "silk-bow",
                "headItem": "none",
                "handItem": "apprentice-wand"
            },
            "name": "Lydia"
        }
        avatar_res = client.patch("/api/auth/avatar", json=avatar_payload, headers=headers)
        assert avatar_res.status_code == 200
        avatar_data = avatar_res.json()
        assert avatar_data["username"] == "Lydia"
        assert avatar_data["avatar_config"] is not None
        print("✓ Avatar configuration update passed (avatar saved to backend)")

        # 11. Verify User Profile retains all progress
        final_me_res = client.get("/api/auth/me", headers=headers)
        assert final_me_res.status_code == 200
        final_user = final_me_res.json()
        assert final_user["username"] == "Lydia"
        assert final_user["personality_house"] == "House Blossom"
        assert final_user["has_completed_induction"] is True
        assert "twin-tails" in final_user["avatar_config"]
        print("✓ Final profile retains house, avatar, and induction state")

    print("\nAll backend authentication and progression tests passed successfully! 🎉")

if __name__ == "__main__":
    test_full_auth_and_models()
