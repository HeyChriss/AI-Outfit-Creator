// src/App.tsx - Updated with AuthProvider and Supabase integration
import React, { useState } from 'react'
import './App.css'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import NewItem from './components/pages/newItem/NewItem'
import AboutUs from './components/pages/AboutUs'  
import Outfit from './components/pages/outfits/Outfit'
import Wardrobe from './components/pages/Wardrobe'
import LoginPage from './components/auth/LoginPage'
import SignUpPage from './components/auth/SignUpPage'
import LandingPage from './components/layout/LandingPage'
import Dashboard from './components/pages/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

type AuthView = 'login' | 'signup' | null;
type CurrentView = 'landing' | 'dashboard' | 'newItem' | 'aboutUs' | 'outfits' | 'wardrobe';

// Main App Component (wrapped by AuthProvider)
function AppContent() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing')
  const [authView, setAuthView] = useState<AuthView>(null)
  const { user, loading } = useAuth()

  // Update view based on user authentication status
  React.useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard')
    } else if (!user && (currentView === 'dashboard' || currentView === 'newItem' || currentView === 'outfits' || currentView === 'wardrobe')) {
      setCurrentView('landing')
    }
  }, [user, currentView])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner text="Loading DrippedUp..." />
        </div>
      </div>
    )
  }

  // Show auth modals
  if (authView === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={() => {
          setAuthView(null)
          setCurrentView('dashboard')
        }}
        onSwitchToSignup={() => setAuthView('signup')}
      />
    )
  }

  if (authView === 'signup') {
    return (
      <SignUpPage 
        onSignUpSuccess={() => {
          setAuthView(null)
          setCurrentView('dashboard')
        }}
        onSwitchToLogin={() => setAuthView('login')}
      />
    )
  }

  // Handle different views based on currentView state
  if (currentView === 'newItem') {
    return (
      <NewItem 
        onBackToDashboard={() => setCurrentView('dashboard')}
        onLoginClick={() => setAuthView('login')}
        onAboutUsClick={() => setCurrentView('aboutUs')}
        onLogoClick={() => setCurrentView('landing')}
        onOutfitClick={() => setCurrentView('outfits')}
        onWardrobeClick={() => setCurrentView('wardrobe')}
      />
    );
  }

  if (currentView === 'outfits') {
    return (
      <Outfit 
        onUploadClick={() => setCurrentView('newItem')}
        onLoginClick={() => setAuthView('login')}
        onAboutUsClick={() => setCurrentView('aboutUs')}
        onLogoClick={() => setCurrentView('landing')}
        onOutfitClick={() => setCurrentView('outfits')}
        onWardrobeClick={() => setCurrentView('wardrobe')}
        onBackToDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'wardrobe') {
    return (
      <Wardrobe 
        onUploadClick={() => setCurrentView('newItem')}
        onOutfitClick={() => setCurrentView('outfits')}
        onLoginClick={() => setAuthView('login')}
        onAboutUsClick={() => setCurrentView('aboutUs')}
        onLogoClick={() => setCurrentView('landing')}
        onWardrobeClick={() => setCurrentView('wardrobe')}
        onBackToDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <ProtectedRoute>
        <Header 
          onLoginClick={() => setAuthView('login')}
          onAboutUsClick={() => setCurrentView('aboutUs')}
          onLogoClick={() => setCurrentView('landing')}
          onOutfitClick={() => setCurrentView('outfits')}
          onWardrobeClick={() => setCurrentView('wardrobe')}
        />
        <main
          style={{
            marginTop: '120px',
            marginBottom: '120px',
            minHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}
        >
          <Dashboard 
            onUploadClick={() => setCurrentView('newItem')} 
            onOutfitClick={() => setCurrentView('outfits')}
            onWardrobeClick={() => setCurrentView('wardrobe')}
          />
        </main>
        <Footer onAboutUsClick={() => setCurrentView('aboutUs')} />
      </ProtectedRoute>
    );
  }

  // Public routes - accessible without authentication
  if (currentView === 'aboutUs') {
    return (
      <AboutUs 
        onBackToDashboard={user ? () => setCurrentView('dashboard') : undefined}
        onLoginClick={() => setAuthView('login')}
        onAboutUsClick={() => setCurrentView('aboutUs')}
        onLogoClick={() => setCurrentView('landing')}
        onOutfitClick={() => setCurrentView('outfits')}
        onWardrobeClick={() => setCurrentView('wardrobe')}
      />
    );
  }

  // Show landing page for non-authenticated users or when explicitly set
  if (!user || currentView === 'landing') {
    return (
      <>
        <Header 
          onLoginClick={() => setAuthView('login')}
          onAboutUsClick={() => setCurrentView('aboutUs')}
          onLogoClick={() => setCurrentView('landing')}
          onOutfitClick={() => setAuthView('login')} 
          onWardrobeClick={() => setAuthView('login')}
        />
        <main
          style={{
            marginTop: '120px',
            marginBottom: '120px',
            minHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}
        >
          <LandingPage 
            onLoginClick={() => setAuthView('login')}
            onSignUpClick={() => setAuthView('signup')}
            onAboutUsClick={() => setCurrentView('aboutUs')}
          />
        </main>
        <Footer onAboutUsClick={() => setCurrentView('aboutUs')} />
      </>
    );
  }

  // Show dashboard for authenticated users (fallback)
  return (
    <>
      <Header 
        onLoginClick={() => setAuthView('login')}
        onAboutUsClick={() => setCurrentView('aboutUs')}
        onLogoClick={() => setCurrentView('landing')}
        onOutfitClick={() => setCurrentView('outfits')}
        onWardrobeClick={() => setCurrentView('wardrobe')}
      />
      <main
        style={{
          marginTop: '120px',
          marginBottom: '120px',
          minHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      >
        <Dashboard 
          onUploadClick={() => setCurrentView('newItem')} 
          onOutfitClick={() => setCurrentView('outfits')}
          onWardrobeClick={() => setCurrentView('wardrobe')}
        />
      </main>
      <Footer onAboutUsClick={() => setCurrentView('aboutUs')} />
      
      {/* Add keyframe animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Root App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App