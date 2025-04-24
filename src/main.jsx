import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import './index.css'
import App from './App.jsx'
import AILearningHub from './components/AILearningHub'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LearnMore from './pages/LearnMore'
import ProfilePage from './components/ProfilePage'
import AuthCallback from './pages/AuthCallback'
import HowItWorks from './pages/HowItWorks'
import SupportedLanguages from './pages/SupportedLanguages'
import ApiDocumentation from './pages/ApiDocumentation'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const Root = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return savedMode === 'true'
    }
    // Otherwise, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', String(newMode))
      return newMode
    })
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/login" element={<LoginPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/signup" element={<SignupPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/learn-more" element={<LearnMore darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />} />
            <Route path="/auth/callback" element={<AuthCallback darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/learning-hub" element={
              <ProtectedRoute>
                <AILearningHub darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />

            {/* Footer Pages */}
            <Route path="/how-it-works" element={<HowItWorks darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/supported-languages" element={<SupportedLanguages darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/api-documentation" element={<ApiDocumentation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/pricing" element={<Pricing darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/blog" element={<Blog darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/terms-of-service" element={<TermsOfService darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/cookie-policy" element={<CookiePolicy darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
