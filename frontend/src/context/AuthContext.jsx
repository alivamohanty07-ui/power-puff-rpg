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
  axios.defaults.baseURL = API_URL;

  const [token, setToken] = useState(
    () => localStorage.getItem('power_puff_token') || null
  );

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
  const [authModalTab, setAuthModalTab] = useState('signup');

  // Configure axios authorization and verify existing session
  useEffect(() => {
    axios.defaults.baseURL = API_URL;

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

            localStorage.setItem(
              'power_puff_user',
              JSON.stringify(profile)
            );
          }
        } catch (err) {
          if (err.response?.status === 401) {
            setToken(null);
            localStorage.removeItem('power_puff_token');
            localStorage.removeItem('power_puff_user');
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
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Perform API login
  const login = async (identifier, password) => {
    try {
      const res = await axios.post('/api/auth/login', {
        username_or_email: identifier,
        password: password
      });

      const data = res.data;

      setToken(data.access_token);
      localStorage.setItem('power_puff_token', data.access_token);

      const profile = {
        ...data.user,
        maxXp: 100 * (data.user.level || 1)
      };

      setUser(profile);
      localStorage.setItem(
        'power_puff_user',
        JSON.stringify(profile)
      );

      setIsAuthenticated(true);
      closeAuthModal();

      return {
        success: true,
        user: profile
      };
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Authentication failed. Backend unreachable.';

      return {
        success: false,
        error: msg
      };
    }
  };

  // Perform API signup
  const signup = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        selected_theme: formData.selected_theme || 'dark-dungeon',
        personality_house:
          formData.personality_house || 'Blossom Leader',
        character_avatar:
          formData.character_avatar || 'warrior_girl'
      });

      const data = res.data;

      setToken(data.access_token);
      localStorage.setItem('power_puff_token', data.access_token);

      const profile = {
        ...data.user,
        maxXp: 100 * (data.user.level || 1)
      };

      setUser(profile);
      localStorage.setItem(
        'power_puff_user',
        JSON.stringify(profile)
      );

      setIsAuthenticated(true);
      closeAuthModal();

      return {
        success: true,
        user: profile
      };
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Signup failed. Backend unreachable.';

      return {
        success: false,
        error: msg
      };
    }
  };

  // Guest adventurer mode
  const enterAsGuest = () => {
    setUser(DEFAULT_GUEST_USER);
    setIsAuthenticated(true);
    closeAuthModal();
  };

  // Create customized character and enter immediately
  const createCustomCharacter = (customData) => {
    const newProfile = {
      ...DEFAULT_GUEST_USER,
      username: customData.username || 'Cyber Adventurer',
      personality_house:
        customData.personality_house || 'Blossom Leader',
      character_avatar:
        customData.character_avatar || 'ren',
      selected_theme:
        customData.selected_theme || 'cyberpunk-neon',
      archetype:
        customData.archetype || 'Netrunner Specialist',
      tactical_gear:
        customData.tactical_gear ||
        'Neural Overclock Visor',
      intellect: customData.intellect ?? 18,
      strength: customData.strength ?? 14,
      vitality: customData.vitality ?? 16,
      mind: customData.mind ?? 20,
      level: 1,
      xp: 0,
      maxXp: 100,
      gold: 500,
      streak: 1
    };

    setUser(newProfile);

    try {
      localStorage.setItem(
        'power_puff_user',
        JSON.stringify(newProfile)
      );
    } catch {}

    setIsAuthenticated(true);
    closeAuthModal();

    return newProfile;
  };

  // Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('power_puff_token');
    localStorage.removeItem('power_puff_user');
    setUser(DEFAULT_GUEST_USER);
    setIsAuthenticated(false);
  };

  // Gamified XP and Gold rewards
  const awardRewards = async (
    xpGain = 50,
    goldGain = 25
  ) => {
    setUser(prev => {
      let newXp = (prev.xp || 0) + xpGain;
      let newLevel = prev.level || 1;
      let maxXp = prev.maxXp || 400;

      let leveledUp = false;

      while (newXp >= maxXp) {
        newXp -= maxXp;
        newLevel += 1;
        maxXp = newLevel * 100;
        leveledUp = true;
      }

      if (leveledUp) {
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
        localStorage.setItem(
          'power_puff_user',
          JSON.stringify(updated)
        );
      } catch {}

      return updated;
    });

    // Sync rewards with backend when authenticated
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        enterAsGuest,
        createCustomCharacter,
        awardRewards
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};