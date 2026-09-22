import { Link } from 'react-router-dom'
import { programDetailPath } from '../../constants/routes'
import Button from '../common/Button'
import Card from '../common/Card'
import StatusBadge from '../common/StatusBadge'
import { formatPeriod, getDday } from '../../utils/dateUtils'

function ProgramCard({ program, featured = false }) {
  const {
    pblancId,
    title = '지원사업명 미정',
    category = '분야 정보 없음',
    organization = '기관 정보 없음',
    applicationStartAt,
    applicationEndAt,
    target = '지원대상 정보 없음',
    summary = '지원내용 정보가 아직 등록되지 않았습니다.',
  } = program ?? {}
  const dDay = getDday(applicationEndAt)

  return (
    <Card as="article" className={featured ? 'program-card program-card--featured' : 'program-card'}>
      <div className="program-card__meta">
        <StatusBadge tone="info">{category}</StatusBadge>
        <StatusBadge tone={dDay === '마감' ? 'neutral' : 'success'}>{dDay}</StatusBadge>
      </div>
      <h3>{title}</h3>
      <dl className="program-card__details">
        <div><dt>기관</dt><dd>{organization}</dd></div>
        <div><dt>신청기간</dt><dd>{formatPeriod(applicationStartAt, applicationEndAt)}</dd></div>
        <div><dt>지원대상</dt><dd>{target}</dd></div>
      </dl>
      <div className="program-card__support"><span>지원내용</span><p>{summary}</p></div>
      <div className="program-card__actions">
        <Button variant="secondary">♡ 관심공고</Button>
        <Link className="button button--primary button--medium" to={programDetailPath(pblancId)}>
          상세보기 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Card>
  )
}

export default ProgramCard
