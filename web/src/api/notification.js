import instance from './axios'

export const getNotification = (id) => instance.get(`/notification/${id}`)

export const getUnreadNotification = (id) => instance.get(`/show-unread/${id}`)

export const deleteNotification = (id) => instance.get(`/notification/delete/${id}`)