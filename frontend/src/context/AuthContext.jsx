import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const API_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_URL;

const AuthContext = createContext(null);

// Default guest stats for instant RPG exploration
const DEFAULT_GUEST_USER = {
  id: 0,
  username: 'Blossom Adventurer',
  email: 'hero@powerpuff.rpg',
  personality_house: 'Blossom Leader',
  character_avatar: 'warrior_girl',
  selected_theme: 'dark-dungeon',
  level: 5,
  xp: 250,
  maxXp: 400,
  gold: 1250,
  streak: 7,
  intellect: 18,
  strength: 14,
  vitality: 16,
  mind: 20
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('power_puff_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('power_puff_user');
      return savedUser ? JSON.parse(savedUser) : DEFAULT_GUEST_USER;
    } catch {
      return DEFAULT_GUEST_USER;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signup'); // 'login' | 'signup'

  // Configure axios authorization header and verify session with backend
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data) {
            const profile = {
              ...res.data,
              maxXp: 100 * (res.data.level || 1)
            };
            setUser(profile);
            setIsAuthenticated(true);
            localStorage.setItem('power_puff_user', JSON.stringify(profile));
          }
        } catch (err) {
          if (err.response?.status === 401) {
            // Token expired or invalid
            setToken(null);
            localStorage.removeItem('power_puff_token');
            setIsAuthenticated(false);
          }
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, [token]);

  const openAuthModal = (tab = 'signup') => {
    setAuthModalTab(tab === 'login' ? 'login' : 'signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openOnboardingModal = () => {
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(true);
  };

  const closeOnboardingModal = () => {
    setIsOnboardingModalOpen(false);
  };

  // Perform API login with graceful fallback
  const login = async (identifier, password) => {
    try {
      const res = await axios.post('/api/auth/login', {
        username_or_email: identifier,
        email: identifier,
        password: password
      });
      const data = res.data;
      setToken(data.access_token);
      localStorage.setItem('power_puff_token', data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      const profile = {
        ...data.user,
        maxXp: 100 * (data.user.level || 1)
      };
      setUser(profile);
      localStorage.setItem('power_puff_user', JSON.stringify(profile));
      setIsAuthenticated(true);
      closeAuthModal();
      return { success: true, user: profile };
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || err.response?.data?.message || 'Authentication failed. Backend unreachable.';
      return { success: false, error: msg };
    }
  };

  // Perform API registration with graceful fallback
  const signup = async (formData) => {
    try {
      const payload = {
        name: formData.name || formData.username,
        username: formData.username || formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        selected_theme: formData.selected_theme || 'dark-dungeon',
        personality_house: formData.personality_house || '',
        character_avatar: formData.character_avatar || 'emily'
      };

      const res = await axios.post('/api/auth/register', payload);
      const data = res.data;
      setToken(data.access_token);
      localStorage.setItem('power_puff_token', data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      const profile = {
        ...data.user,
        maxXp: 100 * (data.user.level || 1)
      };
      setUser(profile);
      localStorage.setItem('power_puff_user', JSON.stringify(profile));
      setIsAuthenticated(true);
      closeAuthModal();
      return { success: true, user: profile };
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || err.response?.data?.message || 'Signup failed. Backend unreachable.';
      return { success: false, error: msg };
    }
  };

  // Guest adventurer mode for immediate demonstration
  const enterAsGuest = () => {
    setUser(DEFAULT_GUEST_USER);
    setIsAuthenticated(true);
    closeAuthModal();
  };

  // Logout cleanly from both frontend and backend
  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch {}
    setToken(null);
    localStorage.removeItem('power_puff_token');
    localStorage.removeItem('power_puff_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(DEFAULT_GUEST_USER);
    setIsAuthenticated(false);
  };

  // Gamified XP and Gold rewards with level calculation & confetti
  const awardRewards = async (xpGain = 50, goldGain = 25) => {
    setUser(prev => {
      let newXp = (prev.xp || 0) + xpGain;
      let newLevel = prev.level || 1;
      let maxXp = prev.maxXp || 400;

      // Check level-up threshold
      let leveledUp = false;
      while (newXp >= maxXp) {
        newXp -= maxXp;
        newLevel += 1;
        maxXp = newLevel * 100;
        leveledUp = true;
      }

      if (leveledUp) {
        // Grand level-up celebration confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      const updated = {
        ...prev,
        xp: newXp,
        maxXp,
        level: newLevel,
        gold: (prev.gold || 0) + goldGain
      };
      try {
        localStorage.setItem('power_puff_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // If authenticated, sync with FastAPI backend
    if (token) {
      try {
        await axios.patch('/api/auth/stats', {
          xp_gain: xpGain,
          gold_gain: goldGain
        });
      } catch {
        // Backend optional sync
      }
    }
  };

  // Sync house attunement with backend (POST /api/users/me/house)
  const saveHouseToBackend = async (houseName, houseId, scores = {}) => {
    if (token) {
      try {
        const res = await axios.post('/api/users/me/house', {
          houseId: houseId,
          houseName: houseName,
          scores: scores
        });
        if (res.data) {
          const canonicalName = res.data.houseName || houseName;
          setUser(prev => {
            const updated = {
              ...(prev || {}),
              personality_house: canonicalName,
              house: canonicalName,
              houseId: res.data.houseId || houseId,
              has_completed_induction: true
            };
            try {
              localStorage.setItem('power_puff_user', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          return { success: true, data: res.data };
        }
      } catch (err) {
        const errorMsg = err.response?.data?.detail || err.message || 'Your house could not be recorded. Please try again.';
        console.error('Backend house save error:', errorMsg);
        return { success: false, error: errorMsg };
      }
    }
    return { success: true };
  };

  // Retrieve saved house selection from backend (GET /api/users/me/house)
  const getSavedHouseFromBackend = async () => {
    if (token) {
      try {
        const res = await axios.get('/api/users/me/house');
        return res.data;
      } catch (err) {
        console.warn('Failed to fetch house selection:', err);
      }
    }
    return { completed: false, houseId: null };
  };

  // Sync avatar customization with backend
  const saveAvatarToBackend = async (avatarData, characterName) => {
    if (token) {
      try {
        const res = await axios.patch('/api/auth/avatar', {
          avatar_data: avatarData,
          name: characterName
        });
        if (res.data) {
          setUser(prev => ({
            ...(prev || {}),
            username: characterName || prev.username,
            avatar_config: JSON.stringify(avatarData)
          }));
        }
      } catch (err) {
        console.warn('Backend avatar sync failed, progress persisted locally:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      isAuthenticated,
      setIsAuthenticated,
      isAuthModalOpen,
      isOnboardingModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      openOnboardingModal,
      closeOnboardingModal,
      login,
      signup,
      logout,
      enterAsGuest,
      awardRewards,
      saveHouseToBackend,
      getSavedHouseFromBackend,
      saveAvatarToBackend
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
