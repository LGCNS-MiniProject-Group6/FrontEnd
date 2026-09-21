import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import ChatPanel from '../components/chat/ChatPanel'
import ReviewConditionCard from '../components/review/ReviewConditionCard'
import ReviewSummary from '../components/review/ReviewSummary'
import { programDetailPath } from '../constants/routes'
import { getProgramMock } from '../mocks/programMock'
import { reviewMock } from '../mocks/reviewMock'

function ReviewPage() {
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const { pblancId } = useParams()
  const program = getProgramMock(pblancId)

  const saveReview = () => {
    setSaved(true)
    setSaveModalOpen(false)
  }

  return (
    <AppLayout className="review-page-container">
      <Link className="back-link" to={programDetailPath(program.pblancId)}>← 공고 상세로</Link>
      <header className="page-heading page-heading--review"><span className="eyebrow">AI 검수 완료</span><h1>AI 신청 적합성 검수 결과</h1><p>{program.title}</p></header>
      <div className="review-layout">
        <div className="review-content">
          <ReviewSummary review={reviewMock} />
          <section className="review-section">
            <div className="section-heading section-heading--compact"><h2>조건별 검수</h2><p>내 정보 · 공고 조건 · 판단 근거를 함께 확인하세요.</p></div>
            <div className="condition-list">{reviewMock.conditions.map((condition) => <ReviewConditionCard key={condition.id} condition={condition} />)}</div>
          </section>
          <div className="review-notes-grid">
            <Card className="review-note review-note--warning"><h2>신청 전에 꼭 확인하세요</h2><ul>{reviewMock.warnings.map((item) => <li key={item}>{item}</li>)}</ul></Card>
            <Card className="review-note review-note--info"><h2>공고에서 확인된 준비서류</h2><ul>{reviewMock.documents.map((item) => <li key={item}>{item}</li>)}</ul></Card>
          </div>
          <p className="review-disclaimer">AI 검수 결과는 신청 전 확인을 돕기 위한 참고 정보이며, 최종 신청 자격은 반드시 원문 공고를 확인해주세요.</p>
          <div className="review-actions"><Button size="large" onClick={() => setSaveModalOpen(true)} disabled={saved}>{saved ? '검수 결과 저장됨' : '검수 결과 저장'}</Button><a className="button button--secondary button--large" href={program.originalUrl} target="_blank" rel="noreferrer">원문 공고 보기 ↗</a></div>
        </div>
        <ChatPanel programTitle={program.title} />
      </div>
      <Modal open={saveModalOpen} title="검수 결과를 저장할까요?" description="마이페이지의 AI 검수기록에서 언제든 다시 확인할 수 있습니다." confirmLabel="저장하기" onConfirm={saveReview} onClose={() => setSaveModalOpen(false)} />
    </AppLayout>
  )
}

export default ReviewPage
