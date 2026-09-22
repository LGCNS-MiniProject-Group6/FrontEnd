import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import supportUpLogo from '../assets/support-up-logo.png'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import SignupStepCard from '../components/signup/SignupStepCard'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { getPasswordValidationError } from '../utils/authUtils'
import { formatCurrency } from '../utils/formatUtils'

const initialForm = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone: '',
  region: '',
  industry: '',
  openingDate: '',
  businessType: '개인사업자',
  employeeCount: 0,
  annualRevenue: '',
}

const stepCopy = [
  ['이메일 입력', '회원가입에 사용할 이메일을 입력해주세요.'],
  ['비밀번호 설정', '영문과 숫자를 포함한 8자 이상의 비밀번호를 설정해주세요.'],
  ['이름 입력', '서비스 이용 시 표시될 이름을 입력해주세요.'],
  ['휴대폰 번호 입력', '맞춤 지원 정보 안내를 받을 휴대폰 번호를 입력해주세요.'],
  ['기본정보 입력 완료', '이제 사업정보를 입력하면 맞춤 공고와 AI 검수를 더 정확하게 이용할 수 있어요.'],
  ['사업장 지역 입력', '주 사업장이 위치한 시·도 및 시·군·구를 입력해주세요.'],
  ['업종 입력', '사업자등록증의 주업종 또는 분류 코드를 입력해주세요.'],
  ['개업일 입력', '사업자등록증에 기재된 개업연월일을 입력해주세요.'],
  ['사업자 유형 선택', '현재 운영 중인 사업자 유형을 선택해주세요.'],
  ['상시근로자 수 입력', '대표자를 제외한 상시근로자 수를 입력해주세요.'],
  ['연 평균 매출액 입력', '직전 사업연도 기준 연 평균 매출액을 입력해주세요.'],
  ['입력정보 확인', '입력한 정보를 확인하고 가입을 완료해주세요.'],
]

function SignupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const { completeSignup } = useAuth()
  const navigate = useNavigate()

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const progressStep = step <= 3 ? step + 1 : step >= 5 && step <= 10 ? step : null

  const validateCurrentStep = () => {
    const requiredByStep = ['email', 'password', 'name', 'phone', null, 'region', 'industry', 'openingDate', 'businessType', 'employeeCount', 'annualRevenue']
    const field = requiredByStep[step]
    if (field && form[field] === '') return '필수 정보를 입력해주세요.'
    if (step === 1) {
      const passwordError = getPasswordValidationError(form.password)
      if (passwordError) return passwordError
    }
    if (step === 1 && form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않습니다.'
    return ''
  }

  const goNext = () => {
    const validationError = validateCurrentStep()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setStep((current) => Math.min(current + 1, stepCopy.length - 1))
  }

  const finishSignup = (includeBusiness = true) => {
    // 현재는 실제 회원가입 API 대신 Mock 사용자 정보를 저장합니다.
    completeSignup({
      name: form.name || '박운영',
      email: form.email,
      phone: form.phone,
      ...(includeBusiness && {
        business: {
          region: form.region,
          industry: form.industry,
          openingDate: form.openingDate,
          businessType: form.businessType,
          employeeCount: Number(form.employeeCount),
          annualRevenue: Number(form.annualRevenue),
        },
      }),
    })
    navigate(ROUTES.HOME)
  }

  const renderField = () => {
    if (step === 0) return <Input label="이메일" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="example@email.com" autoFocus />
    if (step === 1) return <div className="stack"><Input label="비밀번호" type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="비밀번호를 입력해주세요" autoFocus /><Input label="비밀번호 확인" type="password" value={form.passwordConfirm} onChange={(e) => setField('passwordConfirm', e.target.value)} placeholder="비밀번호를 다시 입력해주세요" /></div>
    if (step === 2) return <Input label="이름" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="홍길동" autoFocus />
    if (step === 3) return <Input label="휴대폰 번호" type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="010-1234-5678" autoFocus />
    if (step === 5) return <Input label="주요 사업장 소재지" value={form.region} onChange={(e) => setField('region', e.target.value)} placeholder="서울특별시 강남구" autoFocus />
    if (step === 6) return <><Input label="주업종 또는 분류 코드" value={form.industry} onChange={(e) => setField('industry', e.target.value)} placeholder="온라인 소매업" autoFocus /><div className="signup-suggestions"><span>주요 추천 분야</span>{['제조업', '정보통신업', '도소매업', '전문 서비스업'].map((item) => <button type="button" key={item} onClick={() => setField('industry', item)}>{item}</button>)}</div></>
    if (step === 7) return <Input label="개업연월일" type="date" value={form.openingDate} onChange={(e) => setField('openingDate', e.target.value)} autoFocus />
    if (step === 8) return <div className="choice-list">{['개인사업자', '법인사업자'].map((item) => <button type="button" key={item} className={form.businessType === item ? 'choice choice--active' : 'choice'} onClick={() => setField('businessType', item)}><span aria-hidden="true" /> <div><strong>{item}</strong><small>{item === '개인사업자' ? '일반과세 및 세금 혜택 중심 맞춤형 분류' : '주식회사·유한회사 등 투자유치 특화 공고 분류'}</small></div></button>)}</div>
    if (step === 9) return <div className="number-stepper"><Button variant="secondary" onClick={() => setField('employeeCount', Math.max(0, Number(form.employeeCount) - 1))}>−</Button><strong>{form.employeeCount}<small>명</small></strong><Button variant="secondary" onClick={() => setField('employeeCount', Number(form.employeeCount) + 1)}>＋</Button></div>
    if (step === 10) return <Input label="연 평균 매출액" type="number" min="0" value={form.annualRevenue} onChange={(e) => setField('annualRevenue', e.target.value)} helperText={form.annualRevenue ? `${formatCurrency(form.annualRevenue)}원` : '숫자로 입력해주세요.'} placeholder="120000000" autoFocus />
    return null
  }

  if (step === 4) {
    return (
      <main className="signup-page">
        <Link className="brand signup-brand" to={ROUTES.LOGIN}><img className="brand__logo" src={supportUpLogo} alt="" />지원UP</Link>
        <SignupStepCard title={stepCopy[step][0]} description={stepCopy[step][1]}>
          <div className="signup-complete-icon" aria-hidden="true">✓</div>
          <div className="signup-actions signup-actions--stacked">
            <Button size="large" onClick={goNext}>사업정보 입력 시작하기</Button>
            <Button variant="secondary" onClick={() => finishSignup(false)}>나중에 작성하기</Button>
          </div>
        </SignupStepCard>
      </main>
    )
  }

  if (step === 11) {
    const summary = [
      ['이메일', form.email], ['이름', form.name], ['휴대폰', form.phone],
      ['사업장', form.region], ['업종', form.industry], ['개업일', form.openingDate],
      ['사업자 유형', form.businessType], ['상시근로자', `${form.employeeCount}명`],
      ['연 매출', `${formatCurrency(form.annualRevenue)}원`],
    ]
    return (
      <main className="signup-page">
        <Link className="brand signup-brand" to={ROUTES.LOGIN}><img className="brand__logo" src={supportUpLogo} alt="" />지원UP</Link>
        <SignupStepCard title={stepCopy[step][0]} description={stepCopy[step][1]}>
          <dl className="signup-summary">{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <div className="signup-actions"><Button variant="secondary" onClick={() => setStep(10)}>수정하기</Button><Button onClick={() => finishSignup(true)}>가입 완료하고 시작하기</Button></div>
        </SignupStepCard>
      </main>
    )
  }

  return (
    <main className="signup-page">
      <Link className="brand signup-brand" to={ROUTES.LOGIN}><img className="brand__logo" src={supportUpLogo} alt="" />지원UP</Link>
      <SignupStepCard current={progressStep} total={10} title={stepCopy[step][0]} description={stepCopy[step][1]}>
        <div className="signup-card__body">{renderField()}{error && <p className="form-error" role="alert">{error}</p>}</div>
        <div className="signup-actions">
          <Button
            variant="secondary"
            onClick={() =>
              step === 0
                ? navigate(ROUTES.LOGIN)
                : setStep((current) => Math.max(0, current - 1))
            }
          >
            {step === 0 ? '로그인으로' : '이전'}
          </Button>
          <Button onClick={goNext}>다음</Button>
        </div>
      </SignupStepCard>
    </main>
  )
}

export default SignupPage
