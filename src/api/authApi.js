// api/authApi.js
import axiosInstance from './axiosInstance'

export const authApi = {
  // AUTH-01 회원가입
  signup: (data) => axiosInstance.post('/api/auth/signup', data),

  // AUTH-02 이메일 중복확인 (쿼리스트링으로 email 전달)
  checkEmail: (email) => axiosInstance.get('/api/auth/check-email', { params: { email } }),

  // AUTH-03 인증번호 발송
  sendPhoneCode: (phoneNumber) => axiosInstance.post('/api/phone-verification/send', { phoneNumber }),

  // AUTH-04 인증번호 확인
  verifyPhoneCode: (phoneNumber, code) =>
    axiosInstance.post('/api/phone-verification/verify', { phoneNumber, code }),

  // AUTH-05 로그인
  login: (data) => axiosInstance.post('/api/auth/login', data),

// AUTH-06 로그아웃 (Refresh 토큰을 body로 전달)
  logout: (refreshToken) =>  axiosInstance.post('/api/auth/logout', { refreshToken }),

  // AUTH-07 토큰 재발급 (Refresh 토큰 필요) - 백엔드 대기 중, 연동은 나중에
  reissueToken: () => axiosInstance.post('/api/auth/reissue'),

  // USER-01 마이페이지 조회 - 백엔드 대기 중
  getMyInfo: () => axiosInstance.get('/api/users/me'),

  // USER-02 내 정보 수정 - 백엔드 대기 중
  updateMyInfo: (data) => axiosInstance.put('/api/users/me', data),
}