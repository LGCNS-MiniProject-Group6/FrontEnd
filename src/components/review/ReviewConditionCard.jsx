import Card from '../common/Card'
import ReviewStatusBadge from './ReviewStatusBadge'

function ReviewConditionCard({ condition }) {
  return (
    <Card className="condition-card">
      <div className="condition-card__title">
        <ReviewStatusBadge status={condition.status} />
        <h3>{condition.item}</h3>
      </div>
      <dl>
        <div><dt>내 정보</dt><dd>{condition.myInfo}</dd></div>
        <div><dt>공고 조건</dt><dd>{condition.requirement}</dd></div>
        <div><dt>판단 근거</dt><dd>{condition.reason}</dd></div>
      </dl>
    </Card>
  )
}

export default ReviewConditionCard
