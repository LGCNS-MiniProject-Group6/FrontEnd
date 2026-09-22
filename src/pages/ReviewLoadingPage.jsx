import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import supportUpLogo from '../assets/support-up-logo.png'
import Button from '../components/common/Button'
import { reviewPath } from '../constants/routes'

const loadingSteps = ['사업정보 확인', '공고문 불러오기', '신청조건 분석', '결과 정리']

function ReviewLoadingPage() {
  const [active, setActive] = useState(0)
  const { pblancId } = useParams()
  const navigate = useNavigate()

  // 현재는 화면 확인용 단계 진행입니다. API 연결 전까지 같은 흐름을 유지합니다.
  useEffect(() => {
    if (active >= loadingSteps.length - 1) return undefined
    const timer = window.setTimeout(() => setActive((current) => current + 1), 650)
    return () => window.clearTimeout(timer)
  }, [active])

  return (
    <main className="loading-page">
      <div className="loading-brand"><img src={supportUpLogo} alt="" /> 지원UP</div>
      <section className="review-loading-card">
        <span className="eyebrow">공고와 내 사업정보를 안전하게 비교하고 있어요</span>
        <h1>AI 신청 적합성 검수</h1>
        <p>잠시만 기다려주세요. 확인이 필요한 조건과 근거를 정리하고 있습니다.</p>
        <div className="review-loading-card__progress">
          <span style={{ width: `${((active + 1) / loadingSteps.length) * 100}%` }} />
        </div>
        <ol>
          {loadingSteps.map((item, index) => (
            <li key={item} className={index < active ? 'done' : index === active ? 'active' : ''}>
              <span>{index < active ? '✓' : index === active ? '●' : '○'}</span>
              <div>
                <strong>{item}</strong>
                <small>{index < active ? '확인 완료' : index === active ? '현재 진행 중' : '다음 단계'}</small>
              </div>
            </li>
          ))}
        </ol>
        <Button
          size="large"
          disabled={active < loadingSteps.length - 1}
          onClick={() => navigate(reviewPath(pblancId))}
        >
          {active < loadingSteps.length - 1 ? '검수 중입니다' : '검수 결과 보기'}
        </Button>
      </section>
    </main>
  )
}

export default ReviewLoadingPage
