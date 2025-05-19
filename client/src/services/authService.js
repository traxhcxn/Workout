import axiosClient from "./axiosClient"

export const signup = (userData) => axiosClient.post('/signup', userData)
export const login = (credentials) => axiosClient.post('/login', credentials)