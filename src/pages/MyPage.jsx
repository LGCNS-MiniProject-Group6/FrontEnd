// src/pages/MyPage.jsx
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

function MyPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await authApi.logout(refreshToken)
    } catch (err) {
      console.error('로그아웃 실패:', err)
    } finally {
      // API 성공/실패 여부와 상관없이 로컬 토큰은 지움
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/login')
    }
  }

  return (
    <div>
      <h2>마이페이지</h2>

      {/* TODO: USER-01(마이페이지 조회) 백엔드 완료되면 사용자 정보 표시 */}
      <p>사용자 정보는 준비 중입니다.</p>

      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  )
}

export default MyPage