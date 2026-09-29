import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { businessApi } from '../api/businessApi'
import { favoriteApi } from '../api/favoriteApi'
import { programApi } from '../api/programApi'
import AppLayout from '../components/common/AppLayout'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'
import ProgramCard from '../components/program/ProgramCard'
import ProgramFilter from '../components/program/ProgramFilter'
import ProgramSearchBar from '../components/program/ProgramSearchBar'
import { ROUTES } from '../constants/routes'
import { getDateTimestamp, getDday } from '../utils/dateUtils'
import { normalizeProgramPage } from '../utils/programUtils'

const DEFAULT_FILTERS = {
  category: '전체',
  status: '전체',
  sort: 'closing',
}

const PROGRAM_PAGE_SIZE = 20

function getInitialPage(searchParams) {
  const value = Number(searchParams.get('page'))
  return Number.isInteger(value) && value > 0 ? value - 1 : 0
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
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [category, setCategory] = useState(searchParams.get('category') || DEFAULT_FILTERS.category)
  const [status, setStatus] = useState(searchParams.get('status') || DEFAULT_FILTERS.status)
  const [sort, setSort] = useState(searchParams.get('sort') || DEFAULT_FILTERS.sort)
  const [page, setPage] = useState(() => getInitialPage(searchParams))
  const [sourcePrograms, setSourcePrograms] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 })
  const [programState, setProgramState] = useState('loading')
  const [requestVersion, setRequestVersion] = useState(0)
  const [recommendationState, setRecommendationState] = useState('idle')
  const [favoriteIds, setFavoriteIds] = useState(() => new Set())

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const backendSort = sort === 'latest'
      ? 'applyStartDate,desc'
      : 'applyEndDate,asc'

    programApi.getPrograms({
      keyword: submittedQuery || undefined,
      page,
      size: PROGRAM_PAGE_SIZE,
      sort: backendSort,
    }, { signal: controller.signal }).then(({ data }) => {
      if (!active) return
      setSourcePrograms(normalizeProgramPage(data))
      setPageInfo({
        totalElements: Number(data?.totalElements) || 0,
        totalPages: Number(data?.totalPages) || 0,
      })
      setProgramState('success')
    }).catch((error) => {
      if (active && error.code !== 'ERR_CANCELED') setProgramState('error')
    })

    return () => {
      active = false
      controller.abort()
    }
  }, [page, requestVersion, sort, submittedQuery])

  useEffect(() => {
    let active = true
    favoriteApi.getFavorites()
      .then(({ data }) => {
        if (!active) return
        setFavoriteIds(new Set((Array.isArray(data) ? data : []).map((favorite) => favorite.pblancId)))
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  const programs = useMemo(() => {
    const filtered = sourcePrograms.filter((program) => {
      const matchesCategory = category === '전체' || String(program?.category ?? '').includes(category)
      return matchesCategory && matchesStatus(program, status)
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
  }, [sourcePrograms, category, status, sort])

  const submitSearch = (event) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    const nextParams = new URLSearchParams()

    if (trimmedQuery) nextParams.set('q', trimmedQuery)
    if (category !== DEFAULT_FILTERS.category) nextParams.set('category', category)
    if (status !== DEFAULT_FILTERS.status) nextParams.set('status', status)
    if (sort !== DEFAULT_FILTERS.sort) nextParams.set('sort', sort)

    if (trimmedQuery !== submittedQuery) setProgramState('loading')
    setPage(0)
    setSubmittedQuery(trimmedQuery)
    setSearchParams(nextParams)
  }

  const resetFilters = () => {
    setQuery('')
    setSubmittedQuery('')
    setCategory(DEFAULT_FILTERS.category)
    setStatus(DEFAULT_FILTERS.status)
    setProgramState('loading')
    setSort(DEFAULT_FILTERS.sort)
    setPage(0)
    setRequestVersion((current) => current + 1)
    setSearchParams({})
  }

  const changeSort = (nextSort) => {
    setProgramState('loading')
    setSort(nextSort)
    setPage(0)
  }

  const changeCategory = (nextCategory) => {
    setCategory(nextCategory)
    setPage(0)
  }

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus)
    setPage(0)
  }

  const changePage = (nextPage) => {
    if (nextPage < 0 || nextPage >= pageInfo.totalPages || nextPage === page) return
    setProgramState('loading')
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateFavorite = (pblancId, isFavorite) => {
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (isFavorite) next.add(pblancId)
      else next.delete(pblancId)
      return next
    })
  }

  const retryPrograms = () => {
    setProgramState('loading')
    setRequestVersion((current) => current + 1)
  }

  const runAiRecommendation = async () => {
    if (recommendationState === 'checking-business') return

    setRecommendationState('checking-business')
    try {
      await businessApi.getBusinessInfo()
      // Backend develop에는 추천 API가 아직 없으므로 여기서 가짜 결과를 만들지 않습니다.
      setRecommendationState('api-unavailable')
    } catch (error) {
      if (error.response?.status === 404) {
        setRecommendationState('missing-business')
        return
      }
      setRecommendationState('error')
    }
  }

  const resetRecommendation = () => setRecommendationState('idle')

  return (
    <AppLayout>
      <header className="page-heading">
        <span className="eyebrow">정부지원사업 통합 탐색</span>
        <h1>지원사업 찾기</h1>
        <p>키워드와 조건으로 실제 지원사업을 빠르게 비교해보세요.</p>
      </header>
      <ProgramSearchBar value={query} onChange={setQuery} onSubmit={submitSearch} placeholder="예: 온라인 판로지원, 경영환경 개선" />
      <section className="filter-panel">
        <div><strong>빠른 분야</strong><ProgramFilter selected={category} onSelect={changeCategory} compact /></div>
        <div className="filter-panel__selects">
          <div className="filter-panel__ai">
            <span>맞춤 추천</span>
            <Button
              className="ai-recommendation-button"
              onClick={runAiRecommendation}
              disabled={recommendationState === 'checking-business'}
            >
              {recommendationState === 'checking-business' ? '사업정보 확인 중...' : '✦ AI 맞춤분석'}
            </Button>
          </div>
          <label>신청기간<select value={status} onChange={(event) => changeStatus(event.target.value)}><option>전체</option><option>접수중</option><option>마감 임박</option><option>마감</option></select></label>
          <label>정렬<select value={sort} onChange={(event) => changeSort(event.target.value)}><option value="closing">마감임박순</option><option value="latest">최신순</option></select></label>
        </div>
      </section>

      {recommendationState === 'checking-business' && (
        <section className="ai-recommendation-status" role="status">
          <Loading label="등록한 사업정보를 확인하고 있어요." />
        </section>
      )}
      {recommendationState === 'missing-business' && (
        <section className="ai-recommendation-status" role="status">
          <div>
            <strong>AI 맞춤분석을 이용하려면 사업정보가 필요해요.</strong>
            <p>사업장 지역, 업종, 개업일 등의 정보를 등록하면 나에게 더 관련 있는 지원사업을 찾을 수 있어요.</p>
          </div>
          <Link className="button button--primary button--medium" to={ROUTES.PROFILE_EDIT}>사업정보 입력하기</Link>
        </section>
      )}
      {recommendationState === 'api-unavailable' && (
        <section className="ai-recommendation-status" role="status">
          <div>
            <strong>사업정보를 확인했습니다.</strong>
            <p>AI 추천 API가 아직 준비되지 않아 현재는 전체 공고를 보여드리고 있어요.</p>
          </div>
          <Button variant="secondary" onClick={resetRecommendation}>전체 공고 보기</Button>
        </section>
      )}
      {recommendationState === 'error' && (
        <section className="ai-recommendation-status ai-recommendation-status--error" role="alert">
          <div>
            <strong>사업정보를 확인하지 못했습니다.</strong>
            <p>잠시 후 다시 시도해주세요. 기존 지원사업 목록은 계속 확인할 수 있어요.</p>
          </div>
          <Button variant="secondary" onClick={runAiRecommendation}>다시 시도</Button>
        </section>
      )}

      <section className="program-list-section">
        <div className="section-heading section-heading--compact">
          <h2>총 {pageInfo.totalElements}개의 지원사업</h2>
          <p>{category === '전체' && status === '전체' ? '검색 조건에 맞는 전체 공고 수입니다.' : `현재 페이지에서 필터 조건에 맞는 공고 ${programs.length}개를 표시합니다.`}</p>
        </div>
        {programState === 'loading' ? (
          <div className="program-list-state"><Loading label="지원사업을 불러오고 있어요." /></div>
        ) : programState === 'error' ? (
          <ErrorMessage
            title="지원사업을 불러오지 못했습니다."
            description="백엔드 연결 상태를 확인한 뒤 다시 시도해주세요."
            onRetry={retryPrograms}
          />
        ) : programs.length > 0 ? (
          <>
            <div className="program-list">
              {programs.map((program) => (
                <ProgramCard
                  key={program.pblancId}
                  program={{ ...program, isFavorite: favoriteIds.has(program.pblancId) }}
                  onFavoriteChange={updateFavorite}
                />
              ))}
            </div>
            {pageInfo.totalPages > 1 && (
              <nav className="program-pagination" aria-label="지원사업 페이지">
                <Button variant="secondary" size="small" disabled={page === 0} onClick={() => changePage(page - 1)}>이전</Button>
                <span><strong>{page + 1}</strong> / {pageInfo.totalPages}</span>
                <Button variant="secondary" size="small" disabled={page >= pageInfo.totalPages - 1} onClick={() => changePage(page + 1)}>다음</Button>
              </nav>
            )}
          </>
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
