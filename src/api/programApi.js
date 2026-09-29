import axiosInstance from './axiosInstance'

export const programApi = {
  getPrograms: (params, config = {}) => axiosInstance.get('/programs', { params, ...config }),
  getProgramDetail: (pblancId) => axiosInstance.get(`/programs/${pblancId}`),
}
