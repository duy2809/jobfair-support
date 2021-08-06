import instance from './axios'

export const getProfile = (id) => instance.get(`/profile/${id}`)
export const getAvatar = () => instance.get('/profile/avatar')

