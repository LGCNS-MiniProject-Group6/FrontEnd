const filters = ['전체', '금융', '기술', '인력', '수출', '내수', '창업', '경영', '기타']

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
