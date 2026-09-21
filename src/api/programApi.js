import axiosInstance from './axiosInstance'

export const programApi = {
  getPrograms: (params) => axiosInstance.get('/programs', { params }),
  getProgramDetail: (pblancId) => axiosInstance.get(`/programs/${pblancId}`),
  requestProgramDocument: (pblancId) =>
    axiosInstance.post(`/programs/${pblancId}/document`),
  getProgramDocument: (pblancId) =>
    axiosInstance.get(`/programs/${pblancId}/document`),
}
