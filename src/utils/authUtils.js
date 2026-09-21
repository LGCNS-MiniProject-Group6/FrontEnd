export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

export function isValidPhone(value) {
  return /^01[016789]-?\d{3,4}-?\d{4}$/.test(String(value ?? '').trim())
}

export function getPasswordValidationError(value) {
  if (!value) return '비밀번호를 입력해주세요.'
  if (value.length < 8) return '비밀번호는 8자 이상 입력해주세요.'
  return ''
}

export function maskEmail(value) {
  const [localPart, domain] = String(value ?? '').split('@')
  if (!localPart || !domain) return '아이디 정보 없음'
  return `${localPart.slice(0, 1)}***@${domain}`
}

export function formatTimer(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
