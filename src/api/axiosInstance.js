import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://e07d197c144b32.lhr.life',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance