import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/authApi'
import supportUpLogo from '../assets/support-up-logo.png'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import ErrorMessage from '../components/common/ErrorMessage'
import Input from '../components/common/Input'
import { ROUTES } from '../constants/routes'
import { authMockService } from '../services/authMockService'
import { getApiErrorMessage, isValidPhone } from '../utils/authUtils'

const initialForm = { name: '', phone: '', code: '' } // [수정] code 추가

function FindIdPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [maskedId, setMaskedId] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false) // [추가] 인증번호 발송 여부
  const [isVerified, setIsVerified] = useState(false) // [추가] 인증 완료 여부
  const [verificationState, setVerificationState] = useState('idle')

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))

    // [추가] 인증 후 휴대폰 번호를 바꾸면 인증을 처음부터 다시 받게 함
    if (field === 'phone') {
      setIsCodeSent(false)
      setIsVerified(false)
      setForm((current) => ({ ...current, code: '' }))
    }
  }

  // [추가] 인증번호 받기
  const sendCode = async () => {
    const phone = form.phone.trim()
    if (!phone) return setErrors((current) => ({ ...current, phone: '휴대폰 번호를 입력해주세요.' }))
    if (!isValidPhone(phone)) return setErrors((current) => ({ ...current, phone: '올바른 휴대폰 번호를 입력해주세요.' }))

    setVerificationState('sending')
    setErrors((current) => ({ ...current, phone: '', code: '' }))

    try {
      await authApi.sendPhoneVerification(phone.replace(/\D/g, ''))
      setIsCodeSent(true)
      setIsVerified(false)
      setForm((current) => ({ ...current, code: '' }))
    } catch (requestError) {
      setErrors((current) => ({
        ...current,
        phone: getApiErrorMessage(requestError, '인증번호 발송 중 문제가 발생했습니다.'),
      }))
    } finally {
      setVerificationState('idle')
    }
  }

  // [추가] 인증번호 확인
  const verifyCode = async () => {
    if (!form.code.trim()) return setErrors((current) => ({ ...current, code: '인증번호를 입력해주세요.' }))
    if (!/^\d{6}$/.test(form.code.trim())) return setErrors((current) => ({ ...current, code: '6자리 인증번호를 입력해주세요.' }))

    setErrors((current) => ({ ...current, code: '' }))
    setVerificationState('verifying')

    try {
      const { data } = await authApi.verifyPhoneVerification(
        form.phone.replace(/\D/g, ''),
        form.code.trim(),
      )
      if (!data?.isVerified) {
        setErrors((current) => ({ ...current, code: '인증번호가 일치하지 않습니다.' }))
        return
      }
      setIsVerified(true)
    } catch (requestError) {
      setErrors((current) => ({
        ...current,
        code: getApiErrorMessage(requestError, '인증번호 확인 중 문제가 발생했습니다.'),
      }))
    } finally {
      setVerificationState('idle')
    }
  }

  const validate = () => {
    const nextErrors = {}
    const name = form.name.trim()
    const phone = form.phone.trim()

    if (!name) nextErrors.name = '이름을 입력해주세요.'
    if (!phone) nextErrors.phone = '휴대폰 번호를 입력해주세요.'
    else if (!isValidPhone(phone)) nextErrors.phone = '올바른 휴대폰 번호를 입력해주세요.'
    else if (!isVerified) nextErrors.code = '휴대폰 인증을 완료해주세요.' // [추가]

    setErrors(nextErrors)
    return { valid: Object.keys(nextErrors).length === 0, name, phone }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // [추가] 인증번호 칸에서 엔터를 치면 아이디 찾기 대신 인증번호 확인
    if (isCodeSent && !isVerified && form.code.trim()) {
      verifyCode()
      return
    }

    const values = validate()
    if (!values.valid) return

    setStatus('loading')

    try {
      const result = await authMockService.findId({ name: values.name, phone: values.phone })
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

                {/* [수정] 휴대폰 번호 + 인증번호 받기 버튼을 한 줄에 배치 */}
                <div className="auth-inline-field">
                  <Input
                    label="휴대폰 번호"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    autoComplete="tel"
                    placeholder="010-1234-5678"
                    error={errors.phone}
                  />
                  <Button type="button" variant="secondary" onClick={sendCode} disabled={isVerified || verificationState !== 'idle'}>
                    {verificationState === 'sending' ? '발송 중...' : isCodeSent ? '재발송' : '인증번호 받기'}
                  </Button>
                </div>

                {/* [추가] 인증번호 받기를 누른 뒤에만 보이는 인증번호 입력칸 */}
                {isCodeSent && (
                  <div className="auth-inline-field">
                    <Input
                      label="인증번호"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.code}
                      onChange={(event) => setField('code', event.target.value.replace(/\D/g, ''))}
                      autoComplete="one-time-code"
                      placeholder="인증번호 6자리"
                      disabled={isVerified}
                      error={errors.code}
                      helperText={isVerified ? '휴대폰 인증이 완료되었습니다.' : '입력하신 휴대폰 번호로 인증번호가 발송되었습니다.'}
                    />
                    <Button type="button" variant="secondary" onClick={verifyCode} disabled={isVerified || verificationState !== 'idle'}>
                      {verificationState === 'verifying' ? '확인 중...' : isVerified ? '인증 완료' : '확인'}
                    </Button>
                  </div>
                )}

                {/* [추가] 인증번호를 받기 전에 아이디 찾기를 누르면 안내 */}
                {!isCodeSent && errors.code && <p className="form-error" role="alert">{errors.code}</p>}
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
