import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'https://workout-server-n7s8.onrender.com/api' || 'http://192.168.1.3:5000/api'
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosClient