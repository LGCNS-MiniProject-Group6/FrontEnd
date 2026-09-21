export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/home',
  PROGRAMS: '/programs',
  MY_PAGE: '/mypage',
  PROFILE_EDIT: '/mypage/profile',
}

export const programDetailPath = (pblancId) => `/programs/${pblancId}`
export const reviewLoadingPath = (pblancId) =>
  `/programs/${pblancId}/review/loading`
export const reviewPath = (pblancId) => `/programs/${pblancId}/review`
