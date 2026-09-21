import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import ProgramFilter from '../components/program/ProgramFilter'
import ProgramSearchBar from '../components/program/ProgramSearchBar'
import ProgramCard from '../components/program/ProgramCard'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { programMocks } from '../mocks/programMock'

function HomePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('전체')
  const navigate = useNavigate()
  const { user } = useAuth()

  const search = (event) => {
    event.preventDefault()
    navigate(`${ROUTES.PROGRAMS}?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`)
  }

  return (
    <AppLayout>
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="eyebrow">오늘의 맞춤 지원사업</span>
          <h1>{user?.name ?? '사용자'}님,<br />나에게 맞는 지원사업을 확인해보세요.</h1>
          <p>등록한 사업정보와 공고 조건을 바탕으로 관련성이 높은 사업부터 보여드려요.</p>
          <ProgramSearchBar value={query} onChange={setQuery} onSubmit={search} placeholder="온라인 마케팅, 시설개선, 교육, 판로지원을 검색해보세요" />
          <ProgramFilter selected={category} onSelect={setCategory} compact />
        </div>
        <aside className="profile-summary">
          <span>내 사업정보</span>
          <h2>{user?.business?.industry || '사업정보를 입력해주세요'}</h2>
          <dl>
            <div><dt>지역</dt><dd>{user?.business?.region || '미입력'}</dd></div>
            <div><dt>업력</dt><dd>{user?.business?.businessPeriod || '약 3년'}</dd></div>
            <div><dt>직원</dt><dd>{user?.business?.employeeCount ?? 0}명</dd></div>
          </dl>
          <Link to={ROUTES.MY_PAGE}>사업정보 확인하기 →</Link>
        </aside>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">맞춤 추천</span><h2>{user?.name ?? '사용자'}님에게 관련성이 높은 지원사업</h2><p>추천보다 중요한 건 신청 전 검수예요. 상세 페이지에서 실제 공고 조건을 AI와 확인해보세요.</p></div>
          <Link to={ROUTES.PROGRAMS}>전체 공고 보기 →</Link>
        </div>
        <div className="program-grid">
          {programMocks.slice(0, 3).map((program) => <ProgramCard key={program.pblancId} program={program} featured />)}
        </div>
      </section>

      <section className="how-it-works">
        <div><span>01</span><h3>공고 찾기</h3><p>키워드와 조건으로 지원사업을 탐색합니다.</p></div>
        <div><span>02</span><h3>신청 조건 검수</h3><p>내 사업정보와 공고문 조건을 비교합니다.</p></div>
        <div><span>03</span><h3>결과와 근거 확인</h3><p>준비서류와 추가 확인 항목을 한눈에 봅니다.</p></div>
      </section>
    </AppLayout>
  )
}

export default HomePage
