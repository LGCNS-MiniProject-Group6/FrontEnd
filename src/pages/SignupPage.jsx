import { useState } from 'react'
import { authApi } from '../api/authApi'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await authApi.signup({ email, password })
      alert('회원가입 성공!')
      // 나중에: 로그인 페이지로 이동
    } catch (err) {
      console.error(err)
      setError('회원가입에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>
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
      <button type="submit">가입하기</button>
    </form>
  )
}

export default SignupPage

