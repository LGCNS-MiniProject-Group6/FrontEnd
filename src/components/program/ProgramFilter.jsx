const filters = ['전체', '창업', '경영', '마케팅', '온라인 판로', '시설', '교육', '금융', '수출']

function ProgramFilter({ selected, onSelect, compact = false }) {
  return (
    <div className={compact ? 'chip-group chip-group--compact' : 'chip-group'}>
      {filters.map((filter) => (
        <button
          type="button"
          key={filter}
          className={selected === filter ? 'chip chip--active' : 'chip'}
          onClick={() => onSelect(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default ProgramFilter
