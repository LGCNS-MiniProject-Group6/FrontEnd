import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import supportUpLogo from '../assets/support-up-logo.png'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const [form, setForm] = useState({ email: 'operator@example.com', password: 'password123' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }
    login(form)
    const destination = location.state?.from?.pathname || ROUTES.HOME
    navigate(destination, { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <Link className="brand brand--light" to={ROUTES.LOGIN}>
          <img className="brand__logo" src={supportUpLogo} alt="" />
          지원UP
        </Link>
        <div className="login-intro__copy">
          <span className="eyebrow eyebrow--light">1인 소상공인을 위한 AI 신청 도우미</span>
          <h1>지원사업, 찾는 것에서<br />끝내지 마세요.</h1>
          <p>내 사업정보와 실제 공고문을 비교해<br />신청 전에 AI가 한 번 더 확인해드립니다.</p>
        </div>
        <div className="login-intro__feature">
          <span aria-hidden="true">✦</span>
          <div><strong>AI 신청 전 검수</strong><p>충족·미충족 가능·추가 확인 조건과 근거를 알려드려요.</p></div>
        </div>
      </section>

      <section className="login-form-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <span className="eyebrow">다시 만나 반가워요</span>
          <h2>로그인</h2>
          <p>정부지원사업 AI 신청 도우미를 시작해보세요.</p>
          <div className="login-card__fields">
            <Input
              label="이메일"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="example@email.com"
            />
            <Input
              label="비밀번호"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="비밀번호를 입력해주세요"
            />
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>
          <Button type="submit" size="large">로그인</Button>
          <nav className="login-card__recovery" aria-label="계정 찾기">
            <Link to={ROUTES.FIND_ID}>아이디 찾기</Link>
            <span aria-hidden="true">|</span>
            <Link to={ROUTES.FORGOT_PASSWORD}>비밀번호 찾기</Link>
          </nav>
          <p className="login-card__signup">아직 계정이 없나요? <Link to={ROUTES.SIGNUP}>회원가입</Link></p>
          <small>로그인 후 맞춤 공고 탐색, AI 검수, 저장 기록을 이용할 수 있어요.</small>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
