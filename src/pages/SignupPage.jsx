import { useState } from 'react'
import { authApi } from '../api/authApi'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // 휴대폰 인증 테스트용 state
  const [phone, setPhone] = useState('01099998888')
  const [code, setCode] = useState('')

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

  const handleSendCode = async () => {
    try {
      const res = await authApi.sendPhoneCode(phone)
      console.log('인증번호 발송 성공:', res.data)
      alert('인증번호가 발송되었습니다.')
    } catch (err) {
      console.error('인증번호 발송 실패:', err.response?.status, err.response?.data)
    }
  }

  const handleVerifyCode = async () => {
    try {
      const res = await authApi.verifyPhoneCode(phone, code)
      console.log('인증 성공:', res.data)
      alert('인증되었습니다.')
    } catch (err) {
      console.error('인증 실패:', err.response?.status, err.response?.data)
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

      {/* ↓↓↓ 휴대폰 인증 테스트 (테스트 끝나면 삭제) ↓↓↓ */}
      <hr />
      <div>
        <label>휴대폰 번호</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="button" onClick={handleSendCode}>
          테스트: 인증번호 발송
        </button>
      </div>
      <div>
        <label>인증번호</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="button" onClick={handleVerifyCode}>
          테스트: 인증번호 확인
        </button>
      </div>
      {/* ↑↑↑ 여기까지 ↑↑↑ */}
    </form>
  )
}

export default SignupPage