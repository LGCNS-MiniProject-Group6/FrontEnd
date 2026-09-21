export function formatDate(value) {
  if (!value) return '상시 접수'
  return new Intl.DateTimeFormat('ko-KR').format(new Date(value))
}

export function formatPeriod(start, end) {
  if (!start || !end) return '상시 접수'
  return `${start.replaceAll('-', '.')} ~ ${end.replaceAll('-', '.')}`
}
