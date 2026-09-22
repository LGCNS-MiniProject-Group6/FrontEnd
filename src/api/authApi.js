import axiosInstance from './axiosInstance'

export const authApi = {
  signup: (payload) => axiosInstance.post('/auth/signup', payload),
  checkEmail: (params) => axiosInstance.get('/auth/check-email', { params }),
  sendPhoneVerification: (payload) =>
    axiosInstance.post('/phone-verification/send', payload),
  verifyPhoneVerification: (payload) =>
    axiosInstance.post('/phone-verification/verify', payload),
  login: (payload) => axiosInstance.post('/auth/login', payload),
  logout: (payload) => axiosInstance.post('/auth/logout', payload),
  reissue: (payload) => axiosInstance.post('/auth/reissue', payload),
  findId: (payload) => axiosInstance.post('/auth/find-id', payload),
  resetPassword: (payload) => axiosInstance.put('/auth/password', payload),
  // 백엔드 응답 확인 후 마이페이지에서 사용합니다.
  getMyInfo: () => axiosInstance.get('/users/me'),
  updateMyInfo: (payload) => axiosInstance.put('/users/me', payload),
}
