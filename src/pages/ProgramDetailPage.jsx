import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import StatusBadge from '../components/common/StatusBadge'
import { reviewLoadingPath, ROUTES } from '../constants/routes'
import { getProgramMock } from '../mocks/programMock'
import { formatPeriod } from '../utils/dateUtils'

function ProgramDetailPage() {
  const { pblancId } = useParams()
  const navigate = useNavigate()
  const program = getProgramMock(pblancId)

  const details = [
    ['사업개요', `${program.target}의 판로 개척과 사업 성장을 지원하는 사업입니다.`],
    ['지원대상', program.target],
    ['지원내용', program.support],
    ['신청방법', program.method],
    ['준비서류', program.documents],
    ['문의처', `${program.organization} 사업 담당부서`],
  ]

  return (
    <AppLayout>
      <Link className="back-link" to={ROUTES.PROGRAMS}>← 지원사업 찾기</Link>
      <header className="detail-heading">
        <div><span className="eyebrow">{program.category}</span><h1>{program.title}</h1><p>{program.organization}</p><div className="badge-row"><StatusBadge tone="info">{program.category}</StatusBadge><StatusBadge tone="success">{program.dDay}</StatusBadge></div></div>
        <Button variant="secondary">♡ 관심공고</Button>
      </header>
      <Card className="program-overview">
        <h2>공고 요약</h2>
        <dl><div><dt>신청기간</dt><dd>{formatPeriod(program.applicationStartAt, program.applicationEndAt)}</dd></div><div><dt>지원대상</dt><dd>{program.target}</dd></div><div><dt>지원내용</dt><dd>{program.support}</dd></div><div><dt>신청방법</dt><dd>{program.method}</dd></div></dl>
      </Card>
      <section className="review-cta">
        <div><span className="review-cta__icon" aria-hidden="true">AI</span><div><h2>AI로 신청 조건을 먼저 확인해보세요</h2><p>내 사업정보와 실제 공고문 조건을 비교해 충족·미충족 가능·추가 확인 항목과 판단 근거를 알려드립니다.</p></div></div>
        <Button size="large" onClick={() => navigate(reviewLoadingPath(program.pblancId))}>AI 지원 적합성 검수하기</Button>
      </section>
      <div className="detail-layout">
        <div className="detail-list">{details.map(([label, content]) => <Card key={label} className="detail-row"><h3>{label}</h3><p>{content}</p></Card>)}</div>
        <Card className="detail-helper"><span className="eyebrow">원문 우선 확인</span><h2>공고 도우미</h2><p>AI 검수 결과는 신청 전 확인을 돕는 참고 정보입니다.</p><a className="button button--secondary button--medium" href={program.originalUrl} target="_blank" rel="noreferrer">기업마당 원문 공고 보기 ↗</a></Card>
      </div>
    </AppLayout>
  )
}

export default ProgramDetailPage
