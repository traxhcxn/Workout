export const getToken = () => {
    return localStorage.getItem('token')
}

export const setToken = (token) => {
    return localStorage.setItem('token', token)
}

export const removeToken = () => {
    localStorage.removeItem('token')
}

export const getCurrentUserId = () => {
    const token = getToken()
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId
    } catch (error) {
        return null
    }
}