import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'http://192.168.1.5:5000/api'
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosClient