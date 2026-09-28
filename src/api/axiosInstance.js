import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.219.52:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  let auth = null
  try {
    auth = JSON.parse(localStorage.getItem('support-check-auth') || 'null')
    console.log(axiosInstance)
  } catch {
    localStorage.removeItem('support-check-auth')
  }
  if (auth?.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default axiosInstance
