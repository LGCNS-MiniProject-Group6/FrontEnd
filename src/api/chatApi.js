import axiosInstance from './axiosInstance'

export const chatApi = {
  sendChatMessage: (pblancId, payload) =>
    axiosInstance.post(`/programs/${pblancId}/chat`, payload),
}
