import axiosInstance from './axiosInstance'

export const reviewApi = {
  createReview: (pblancId) =>
    axiosInstance.post(`/programs/${pblancId}/review`),
  getReviews: (params) => axiosInstance.get('/reviews', { params }),
  getReviewDetail: (reviewId) => axiosInstance.get(`/reviews/${reviewId}`),
}
