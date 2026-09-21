import { useState } from 'react'
import { Link } from 'react-router-dom'
import supportUpLogo from '../assets/support-up-logo.png'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import ErrorMessage from '../components/common/ErrorMessage'
import Input from '../components/common/Input'
import { ROUTES } from '../constants/routes'
import { authMockService } from '../services/authMockService'
import { isValidPhone } from '../utils/authUtils'

const initialForm = { name: '', phone: '' }

function FindIdPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [maskedId, setMaskedId] = useState('')

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    const name = form.name.trim()
    const phone = form.phone.trim()

    if (!name) nextErrors.name = '이름을 입력해주세요.'
    if (!phone) nextErrors.phone = '휴대폰 번호를 입력해주세요.'
    else if (!isValidPhone(phone)) nextErrors.phone = '올바른 휴대폰 번호를 입력해주세요.'

    setErrors(nextErrors)
    return { valid: Object.keys(nextErrors).length === 0, name, phone }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const values = validate()
    if (!values.valid) return

    setStatus('loading')

    try {
      const result = await authMockService.findId(values)
      if (!result.found) {
        setStatus('not-found')
        return
      }
      setMaskedId(result.maskedId)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const retry = () => {
    setStatus('form')
    setMaskedId('')
  }

  return (
    <main className="auth-page">
      <div className="auth-page__shell">
        <Link className="brand auth-brand" to={ROUTES.LOGIN}><img className="brand__logo" src={supportUpLogo} alt="" />지원UP</Link>
        <Link className="back-link" to={ROUTES.LOGIN}>← 로그인으로 돌아가기</Link>
        <Card className="auth-card">
          {status === 'success' ? (
            <div className="auth-result">
              <div className="auth-result__icon" aria-hidden="true">✓</div>
              <span className="eyebrow">아이디 찾기 완료</span>
              <h1>회원님의 아이디를 찾았습니다.</h1>
              <strong className="masked-id">{maskedId}</strong>
              <p>개인정보 보호를 위해 이메일 일부를 가려서 표시했습니다.</p>
              <div className="auth-actions auth-actions--stacked">
                <Link className="button button--primary button--large" to={ROUTES.LOGIN}>로그인하러 가기</Link>
                <Link className="button button--secondary button--large" to={ROUTES.FORGOT_PASSWORD}>비밀번호 찾기</Link>
              </div>
            </div>
          ) : status === 'not-found' || status === 'error' ? (
            <ErrorMessage
              title={status === 'not-found' ? '일치하는 회원을 찾을 수 없습니다.' : '일시적인 오류가 발생했습니다.'}
              description={status === 'not-found' ? '입력하신 이름과 휴대폰 번호를 다시 확인해주세요.' : '잠시 후 다시 시도해주세요.'}
              actionLabel="다시 입력하기"
              onRetry={retry}
            />
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <span className="eyebrow">계정 정보 확인</span>
              <h1>아이디 찾기</h1>
              <p className="auth-card__description">가입할 때 등록한 정보를 입력해주세요.</p>
              <div className="auth-fields">
                <Input
                  label="이름"
                  value={form.name}
                  onChange={(event) => setField('name', event.target.value)}
                  autoComplete="name"
                  placeholder="홍길동"
                  error={errors.name}
                />
                <Input
                  label="휴대폰 번호"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  autoComplete="tel"
                  placeholder="010-1234-5678"
                  error={errors.phone}
                />
              </div>
              <Button type="submit" size="large" disabled={status === 'loading'}>
                {status === 'loading' ? '아이디 찾는 중...' : '아이디 찾기'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  )
}

export default FindIdPage
