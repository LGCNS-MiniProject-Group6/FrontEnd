import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('support-check-auth') || 'null')
  if (auth?.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default axiosInstance
