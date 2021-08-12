import instance from './axios'

export const getNotification = (id) => instance.get(`/notification/${id}`)

