// src/App.tsx - Updated with About Us page
import React, { useState } from 'react'
import './App.css'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import NewItem from './components/pages/newItem/NewItem'
import AboutUs from './components/pages/AboutUs'  // Add this import
import LoginPage from './components/auth/LoginPage'
import SignUpPage from './components/auth/SignUpPage'
import LandingPage from './components/layout/LandingPage'
import Dashboard from './components/pages/Dashboard'
import { useAuth } from './contexts/AuthContext'

type AuthView = 'login' | 'signup' | null;
type CurrentView = 'landing' | 'dashboard' | 'newItem' | 'aboutUs';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing')
  const [authView, setAuthView] = useState<AuthView>(null)
  const { user, loading } = useAuth()

  // Update view based on user authentication status
  React.useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard')
    } else if (!user && (currentView === 'dashboard' || currentView === 'newItem')) {
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
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255,255,255,0.3)', 
            borderTop: '3px solid white', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading DrippedUp...
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
    return <NewItem onBackToDashboard={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'aboutUs') {
    return (
      <AboutUs 
        onBackToDashboard={user ? () => setCurrentView('dashboard') : undefined}
        onLoginClick={() => setAuthView('login')}
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

  // Show dashboard for authenticated users
  return (
    <>
      <Header 
        onLoginClick={() => setAuthView('login')}
        onAboutUsClick={() => setCurrentView('aboutUs')}
      />
      <main
        style={{
          marginTop: '120px',
          marginBottom: '120px',
          minHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      >
        <Dashboard onUploadClick={() => setCurrentView('newItem')} />
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
  )
}

export default App