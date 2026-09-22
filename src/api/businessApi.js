// api/businessApi.js
import axiosInstance from './axiosInstance'

export const businessApi = {
  // BIZ-01 사업정보 등록
  createBusinessInfo: (data) => axiosInstance.post('/api/users/me/business-info', data),

  // BIZ-02 사업정보 조회
  getBusinessInfo: () => axiosInstance.get('/api/users/me/business-info'),

  // BIZ-03 사업정보 수정 - 백엔드 대기 중
  updateBusinessInfo: (data) => axiosInstance.put('/api/users/me/business-info', data),
}