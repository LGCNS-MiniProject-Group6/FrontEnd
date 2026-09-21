import { useLayoutEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import ProgramListPage from '../pages/ProgramListPage'
import ProgramDetailPage from '../pages/ProgramDetailPage'
import ReviewLoadingPage from '../pages/ReviewLoadingPage'
import ReviewPage from '../pages/ReviewPage'
import MyPage from '../pages/MyPage'
import ProfileEditPage from '../pages/ProfileEditPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/programs" element={<ProgramListPage />} />
          <Route path="/programs/:pblancId" element={<ProgramDetailPage />} />
          <Route
            path="/programs/:pblancId/review/loading"
            element={<ReviewLoadingPage />}
          />
          <Route path="/programs/:pblancId/review" element={<ReviewPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/profile" element={<ProfileEditPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
