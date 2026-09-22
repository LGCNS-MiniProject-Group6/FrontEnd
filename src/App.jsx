<<<<<<< HEAD
import { AuthProvider } from './context/AuthProvider'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'   
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />   
      </Routes>
    </BrowserRouter>
>>>>>>> feature/auth
  )
}

export default App