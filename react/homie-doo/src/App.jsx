import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing-page/landing-page'
import LoginPage from './pages/login/login-page'
import DashboardPage from './pages/dashboard/dashboard-page'
import PreviewDocument from './pages/dashboard/preview_document'
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/preview-document" element={<PreviewDocument />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
