import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { favoriteApi } from '../api/favoriteApi'
import { programApi } from '../api/programApi'
import AppLayout from '../components/common/AppLayout'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'
import StatusBadge from '../components/common/StatusBadge'
import { reviewLoadingPath, ROUTES } from '../constants/routes'
import { formatPeriod, getDday } from '../utils/dateUtils'
import { normalizeProgram } from '../utils/programUtils'

function ProgramDetailPage() {
  const { pblancId } = useParams()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [programState, setProgramState] = useState('loading')
  const [favorite, setFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let active = true

    Promise.all([
      programApi.getProgramDetail(pblancId),
      favoriteApi.getFavorites().catch(() => ({ data: [] })),
    ]).then(([{ data }, { data: favorites }]) => {
      if (!active) return
      setProgram(normalizeProgram(data))
      setFavorite((Array.isArray(favorites) ? favorites : []).some((item) => item.pblancId === pblancId))
      setProgramState('success')
    }).catch(() => {
      if (active) setProgramState('error')
    })

    return () => {
      active = false
    }
  }, [pblancId, requestVersion])

  const moveToReview = () => navigate(reviewLoadingPath(pblancId))

  const toggleFavorite = async () => {
    if (favoriteLoading) return
    setFavoriteLoading(true)
    try {
      if (favorite) await favoriteApi.removeFavorite(pblancId)
      else await favoriteApi.addFavorite(pblancId)
      setFavorite((current) => !current)
    } catch (error) {
      if (!favorite && error.response?.status === 409) setFavorite(true)
      if (favorite && error.response?.status === 404) setFavorite(false)
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (programState === 'loading') {
    return <AppLayout><div className="program-list-state"><Loading label="지원사업 상세정보를 불러오고 있어요." /></div></AppLayout>
  }

  if (programState === 'error' || !program) {
    return (
      <AppLayout>
        <Link className="back-link" to={ROUTES.PROGRAMS}>← 지원사업 찾기</Link>
        <ErrorMessage
          title="지원사업 상세정보를 불러오지 못했습니다."
          description="공고가 삭제되었거나 Backend 연결에 문제가 있을 수 있습니다."
          onRetry={() => {
            setProgramState('loading')
            setRequestVersion((current) => current + 1)
          }}
        />
      </AppLayout>
    )
  }

  const details = [
    ['지원대상', program.target || '지원대상 정보가 없습니다.'],
    ['지원내용', program.summary || '지원내용 정보가 없습니다.'],
    ['공고 정보 갱신일', program.apiUpdatedAt || '갱신일 정보가 없습니다.'],
  ]

  return (
    <AppLayout>
      <Link className="back-link" to={ROUTES.PROGRAMS}>← 지원사업 찾기</Link>

      <header className="detail-heading">
        <div>
          <span className="eyebrow">{program.category || '분야 정보 없음'}</span>
          <h1>{program.title || '지원사업명 미정'}</h1>
          <p>{program.organization || '기관 정보 없음'}</p>
          <div className="badge-row">
            <StatusBadge tone="info">{program.category || '분야 정보 없음'}</StatusBadge>
            <StatusBadge tone={getDday(program.applicationEndAt) === '마감' ? 'neutral' : 'success'}>{getDday(program.applicationEndAt)}</StatusBadge>
          </div>
        </div>
        <Button variant="secondary" onClick={toggleFavorite} disabled={favoriteLoading} className={favorite ? 'is-favorite' : ''}>
          {favorite ? '♥' : '♡'} {favoriteLoading ? '처리 중...' : '관심공고'}
        </Button>
      </header>

      <Card className="program-overview">
        <h2>공고 요약</h2>
        <dl>
          <div><dt>신청기간</dt><dd>{formatPeriod(program.applicationStartAt, program.applicationEndAt, program.rawApplyPeriod)}</dd></div>
          <div><dt>지원대상</dt><dd>{program.target || '지원대상 정보가 없습니다.'}</dd></div>
          <div><dt>지원내용</dt><dd>{program.summary || '지원내용 정보가 없습니다.'}</dd></div>
        </dl>
      </Card>

      <section className="review-cta">
        <div>
          <span className="review-cta__icon" aria-hidden="true">AI</span>
          <div>
            <h2>AI로 신청 조건을 먼저 확인해보세요</h2>
            <p>검수 Backend가 준비되기 전까지 Demo 화면에서 서비스 흐름을 확인할 수 있습니다.</p>
          </div>
        </div>
        <Button size="large" onClick={moveToReview}>AI 지원 적합성 검수하기</Button>
      </section>

      <div className="detail-layout">
        <div className="detail-list">
          {details.map(([label, content]) => (
            <Card key={label} className="detail-row"><h3>{label}</h3><p>{content}</p></Card>
          ))}
        </div>
        <Card className="detail-helper">
          <span className="eyebrow">Backend 제공 정보</span>
          <h2>공고 안내</h2>
          <p>현재 상세 API에는 원문 URL과 준비서류, 신청방법이 포함되어 있지 않습니다.</p>
        </Card>
      </div>
    </AppLayout>
  )
}

export default ProgramDetailPage
