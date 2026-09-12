import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CharacterOnboardingModal from './components/onboarding/CharacterOnboardingModal';
import ThemeBackdrop from './components/ThemeBackdrop';
import Home from './pages/Home';
import AvatarCreationView from './components/avatar/AvatarCreationView';
import VirtualWorldView from './components/VirtualWorldView';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { isAuthenticated, user, isOnboardingModalOpen, closeOnboardingModal, openOnboardingModal } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'avatar' | 'world'
  const [companionChar, setCompanionChar] = useState(() => {
    try {
      const saved = localStorage.getItem('rpg_companion_char');
      if (saved === 'aiko') return 'emily';
      return saved || 'emily';
    } catch {
      return 'emily';
    }
  });

  const handleSelectCompanion = (charId) => {
    setCompanionChar(charId);
    try {
      localStorage.setItem('rpg_companion_char', charId);
    } catch {}
  };

  // When user successfully authenticates with completed induction, automatically enter avatar view
  useEffect(() => {
    if (isAuthenticated && user?.has_completed_induction) {
      setCurrentView('avatar');
    }
  }, [isAuthenticated, user?.has_completed_induction]);

  return (
    <div className="min-h-screen bg-rpg-bg text-rpg-text transition-colors duration-500 flex flex-col font-sans relative">
      {/* Dynamic Theme Visual Animations Layer */}
      <ThemeBackdrop />

      {/* Navigation Bar */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        companionChar={companionChar}
        onSelectCompanion={handleSelectCompanion}
      />

      {/* Main Content View (Strict Public Overview vs Avatar Customization Chamber) */}
      <main className="flex-grow">
        {currentView === 'avatar' || currentView === 'world' ? (
          <AvatarCreationView 
            onBackToHome={() => setCurrentView('home')} 
            onBackToInduction={() => openOnboardingModal()} 
          />
        ) : (
          <Home 
            companionChar={companionChar}
            onSelectCompanion={handleSelectCompanion}
          />
        )}
      </main>

      {/* Login & Character Creation Modal */}
      <AuthModal />

      {/* House Induction & Personality Sorting Ceremony Modal */}
      <CharacterOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {
          closeOnboardingModal();
          if (!user?.has_completed_induction) {
            setCurrentView('home');
          }
        }}
        onEnterWorld={() => setCurrentView('avatar')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
