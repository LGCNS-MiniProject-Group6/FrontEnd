// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await authApi.login({ email, password })
      console.log('로그인 응답:', response.data)
      alert('로그인 성공!')
      navigate('/')
    } catch (err) {
      console.error(err)

      if (!err.response) {
        // 서버 자체에 응답을 못 받은 경우 (CORS, 서버 꺼짐, 네트워크 문제 등)
        setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
      } else if (err.response.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        setError('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">로그인</button>

      {/* ↓↓↓ 여기 추가 (테스트 끝나면 삭제) ↓↓↓ */}
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await authApi.signup({
              email: 'test@test.com',
              password: 'Test1234!',
              name: '테스트유저',
              phone: '01012345678',
            })
            console.log('회원가입 성공:', res.data)
          } catch (err) {
            console.error('회원가입 실패:', err.response?.status, err.response?.data)
          }
        }}
      >
        테스트: 회원가입 API 호출
      </button>
      {/* ↑↑↑ 여기까지 ↑↑↑ */}
    </form>
  )
}

export default LoginPage