import { Link } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import Card from '../components/common/Card'
import ReviewStatusBadge from '../components/review/ReviewStatusBadge'
import { programDetailPath, reviewPath, ROUTES } from '../constants/routes'
import { REVIEW_STATUS } from '../constants/reviewStatus'
import { useAuth } from '../hooks/useAuth'
import { programMocks } from '../mocks/programMock'
import { formatCurrency } from '../utils/formatUtils'

function MyPage() {
  const { user } = useAuth()
  const business = user?.business || {}

  // 현재 검수기록과 관심공고는 화면 확인용 임시 데이터입니다.
  const program = programMocks[0]
  const favoriteProgram = programMocks[1]

  return (
    <AppLayout>
      <header className="page-heading">
        <span className="eyebrow">내 활동 한눈에 보기</span>
        <h1>마이페이지</h1>
        <p>프로필과 사업정보, 관심공고, AI 검수기록을 한 곳에서 관리하세요.</p>
      </header>

      <div className="mypage-layout">
        <aside className="mypage-sidebar">
          <div className="mypage-sidebar__profile">
            <div>{user?.name?.slice(0, 1) || '사'}</div>
            <strong>{user?.name || '사용자'}</strong>
            <span>{business.industry || '1인 사업자'}</span>
          </div>
          <nav aria-label="마이페이지 메뉴">
            <a href="#profile">내 프로필</a>
            <a href="#business">사업정보</a>
            <a href="#reviews">AI 검수기록</a>
            <a href="#favorites">관심공고</a>
          </nav>
        </aside>

        <div className="mypage-content">
          <Card className="mypage-card" as="section">
            <div className="mypage-card__heading">
              <div>
                <span className="eyebrow">계정 정보</span>
                <h2 id="profile">내 프로필</h2>
              </div>
              <Link className="button button--secondary button--small" to={ROUTES.PROFILE_EDIT}>프로필 수정</Link>
            </div>
            <dl className="info-grid">
              <div><dt>이름</dt><dd>{user?.name}</dd></div>
              <div><dt>이메일</dt><dd>{user?.email}</dd></div>
              <div><dt>휴대폰</dt><dd>{user?.phone}</dd></div>
            </dl>
          </Card>

          <Card className="mypage-card" as="section">
            <div className="mypage-card__heading">
              <div>
                <span className="eyebrow">맞춤 추천 기준</span>
                <h2 id="business">사업정보</h2>
              </div>
              <Link className="button button--secondary button--small" to={ROUTES.PROFILE_EDIT}>사업정보 수정</Link>
            </div>
            <dl className="info-grid info-grid--three">
              <div><dt>지역</dt><dd>{business.region || '미입력'}</dd></div>
              <div><dt>업종</dt><dd>{business.industry || '미입력'}</dd></div>
              <div><dt>개업일</dt><dd>{business.openingDate || '미입력'}</dd></div>
              <div><dt>사업자 유형</dt><dd>{business.businessType || '미입력'}</dd></div>
              <div><dt>상시근로자</dt><dd>{business.employeeCount ?? 0}명</dd></div>
              <div>
                <dt>연 매출</dt>
                <dd>{business.annualRevenue ? `${formatCurrency(business.annualRevenue)}원` : '미입력'}</dd>
              </div>
            </dl>
          </Card>

          <section className="mypage-section" id="reviews">
            <div className="section-heading section-heading--compact">
              <h2>최근 AI 검수기록</h2>
              <p>저장된 검수 결과를 다시 확인할 수 있어요.</p>
            </div>
            <Card className="activity-card">
              <div>
                <ReviewStatusBadge status={REVIEW_STATUS.NEED_CHECK} />
                <h3>{program.title}</h3>
                <p>검수일 2026.09.19 · 충족 2 / 추가 확인 2 / 미충족 가능 1</p>
              </div>
              <Link className="button button--primary button--small" to={reviewPath(program.pblancId)}>
                검수 결과 다시보기
              </Link>
            </Card>
          </section>

          <section className="mypage-section" id="favorites">
            <div className="section-heading section-heading--compact">
              <h2>관심공고</h2>
              <p>저장한 공고를 빠르게 확인하세요.</p>
            </div>
            <Card className="activity-card">
              <div>
                <span className="eyebrow">마감 D-6</span>
                <h3>{favoriteProgram.title}</h3>
                <p>{favoriteProgram.organization}</p>
              </div>
              <div className="inline-actions">
                <Link className="button button--secondary button--small" to={programDetailPath(favoriteProgram.pblancId)}>
                  상세보기
                </Link>
                <button type="button" className="text-button">관심공고 해제</button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}

export default MyPage
