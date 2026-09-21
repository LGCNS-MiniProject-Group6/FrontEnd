import { Link } from 'react-router-dom'
import { programDetailPath } from '../../constants/routes'
import Button from '../common/Button'
import Card from '../common/Card'
import StatusBadge from '../common/StatusBadge'
import { formatPeriod } from '../../utils/dateUtils'

function ProgramCard({ program, featured = false }) {
  return (
    <Card className={featured ? 'program-card program-card--featured' : 'program-card'}>
      <div className="program-card__meta">
        <StatusBadge tone="info">{program.category}</StatusBadge>
        <StatusBadge tone="success">{program.dDay}</StatusBadge>
      </div>
      <h3>{program.title}</h3>
      <dl className="program-card__details">
        <div><dt>기관</dt><dd>{program.organization}</dd></div>
        <div><dt>신청기간</dt><dd>{formatPeriod(program.applicationStartAt, program.applicationEndAt)}</dd></div>
        <div><dt>지원대상</dt><dd>{program.target}</dd></div>
      </dl>
      {!featured && <p className="program-card__support">{program.support}</p>}
      <div className="program-card__actions">
        <Button variant="secondary">♡ 관심공고</Button>
        <Link className="button button--primary button--medium" to={programDetailPath(program.pblancId)}>
          상세보기
        </Link>
      </div>
    </Card>
  )
}

export default ProgramCard
