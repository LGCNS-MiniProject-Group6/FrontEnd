import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import ProgramCard from '../components/program/ProgramCard'
import ProgramFilter from '../components/program/ProgramFilter'
import ProgramSearchBar from '../components/program/ProgramSearchBar'
import { programMocks } from '../mocks/programMock'
import { getDateTimestamp, getDday } from '../utils/dateUtils'

const DEFAULT_FILTERS = {
  category: '전체',
  region: '전체 지역',
  status: '전체',
  sort: 'closing',
}

function includesKeyword(program, keyword) {
  if (!keyword) return true

  return [
    program?.title,
    program?.category,
    program?.organization,
    program?.target,
    program?.summary,
  ]
    .map((value) => String(value ?? '').toLowerCase())
    .some((value) => value.includes(keyword))
}

function matchesStatus(program, status) {
  if (status === '전체') return true

  const dDay = getDday(program?.applicationEndAt)

  if (status === '마감') return dDay === '마감'
  if (status === '접수중') return dDay !== '마감'
  if (status === '마감 임박') {
    if (dDay === 'D-Day') return true
    const remainingDays = /^D-(\d+)$/.exec(dDay)
    return remainingDays ? Number(remainingDays[1]) <= 7 : false
  }

  return true
}

function closingSortValue(program) {
  const timestamp = getDateTimestamp(program?.applicationEndAt)
  const dDay = getDday(program?.applicationEndAt)

  if (dDay === '마감') return Number.MAX_SAFE_INTEGER
  if (timestamp === null) return Number.MAX_SAFE_INTEGER - 1
  return timestamp
}

function ProgramListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || DEFAULT_FILTERS.category)
  const [region, setRegion] = useState(searchParams.get('region') || DEFAULT_FILTERS.region)
  const [status, setStatus] = useState(searchParams.get('status') || DEFAULT_FILTERS.status)
  const [sort, setSort] = useState(searchParams.get('sort') || DEFAULT_FILTERS.sort)

  // 현재는 공고 목록을 Mock 데이터에서 가져와 검색과 필터를 적용합니다.
  const regions = useMemo(
    () => [...new Set(programMocks.map((program) => program.region).filter(Boolean))],
    [],
  )

  const programs = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = programMocks.filter((program) => {
      const matchesCategory = category === '전체' || String(program?.category ?? '').includes(category)
      const matchesRegion = region === '전체 지역' || program?.region === region

      return (
        includesKeyword(program, normalized) &&
        matchesCategory &&
        matchesRegion &&
        matchesStatus(program, status)
      )
    })

    return [...filtered].sort((first, second) => {
      if (sort === 'latest') {
        return (
          (getDateTimestamp(second.applicationStartAt) ?? -Infinity) -
          (getDateTimestamp(first.applicationStartAt) ?? -Infinity)
        )
      }

      return closingSortValue(first) - closingSortValue(second)
    })
  }, [query, category, region, status, sort])

  const submitSearch = (event) => {
    event.preventDefault()
    const nextParams = new URLSearchParams()

    if (query.trim()) nextParams.set('q', query.trim())
    if (category !== DEFAULT_FILTERS.category) nextParams.set('category', category)
    if (region !== DEFAULT_FILTERS.region) nextParams.set('region', region)
    if (status !== DEFAULT_FILTERS.status) nextParams.set('status', status)
    if (sort !== DEFAULT_FILTERS.sort) nextParams.set('sort', sort)

    setSearchParams(nextParams)
  }

  const resetFilters = () => {
    setQuery('')
    setCategory(DEFAULT_FILTERS.category)
    setRegion(DEFAULT_FILTERS.region)
    setStatus(DEFAULT_FILTERS.status)
    setSort(DEFAULT_FILTERS.sort)
    setSearchParams({})
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
          <label>지역<select value={region} onChange={(event) => setRegion(event.target.value)}><option>전체 지역</option>{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>신청기간<select value={status} onChange={(event) => setStatus(event.target.value)}><option>전체</option><option>접수중</option><option>마감 임박</option><option>마감</option></select></label>
          <label>정렬<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="closing">마감임박순</option><option value="latest">최신순</option></select></label>
        </div>
      </section>
      <section className="program-list-section">
        <div className="section-heading section-heading--compact"><h2>총 {programs.length}개의 지원사업</h2><p>검색 조건에 맞는 공고를 신청 마감일 기준으로 정리했습니다.</p></div>
        {programs.length > 0 ? (
          <div className="program-list">{programs.map((program) => <ProgramCard key={program.pblancId} program={program} />)}</div>
        ) : (
          <div className="program-empty">
            <EmptyState title="검색 결과가 없습니다." description="검색어나 필터 조건을 변경해보세요." />
            <Button variant="secondary" onClick={resetFilters}>필터 초기화</Button>
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default ProgramListPage
