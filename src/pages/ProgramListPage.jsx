import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import EmptyState from '../components/common/EmptyState'
import ProgramCard from '../components/program/ProgramCard'
import ProgramFilter from '../components/program/ProgramFilter'
import ProgramSearchBar from '../components/program/ProgramSearchBar'
import { programMocks } from '../mocks/programMock'

function ProgramListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '전체')

  const programs = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return programMocks.filter((program) => {
      const matchesQuery = !normalized || `${program.title} ${program.category} ${program.target}`.toLowerCase().includes(normalized)
      const matchesCategory = category === '전체' || program.category.includes(category)
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const submitSearch = (event) => {
    event.preventDefault()
    setSearchParams({ q: query, category })
  }

  return (
    <AppLayout>
      <header className="page-heading">
        <span className="eyebrow">정부지원사업 통합 탐색</span>
        <h1>지원사업 찾기</h1>
        <p>키워드와 조건으로 실제 지원사업을 빠르게 비교해보세요.</p>
      </header>
      <ProgramSearchBar value={query} onChange={setQuery} onSubmit={submitSearch} placeholder="예: 온라인 판로지원, 경영환경 개선" />
      <section className="filter-panel">
        <div><strong>빠른 분야</strong><ProgramFilter selected={category} onSelect={setCategory} compact /></div>
        <div className="filter-panel__selects">
          <label>지역<select defaultValue="서울"><option>전체 지역</option><option>서울</option><option>경기</option></select></label>
          <label>신청기간<select defaultValue="접수중"><option>전체</option><option>접수중</option><option>마감 임박</option></select></label>
          <label>정렬<select defaultValue="마감일"><option>마감일</option><option>최신순</option></select></label>
        </div>
      </section>
      <section className="program-list-section">
        <div className="section-heading section-heading--compact"><h2>총 {programs.length}개의 지원사업</h2><p>검색 조건에 맞는 공고를 신청 마감일 기준으로 정리했습니다.</p></div>
        {programs.length > 0 ? (
          <div className="program-list">{programs.map((program) => <ProgramCard key={program.pblancId} program={program} />)}</div>
        ) : (
          <EmptyState title="검색 결과가 없습니다." description="검색어나 분야를 바꿔 다시 확인해보세요." />
        )}
      </section>
    </AppLayout>
  )
}

export default ProgramListPage
