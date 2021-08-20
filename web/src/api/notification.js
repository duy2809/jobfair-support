import instance from './axios'

export const getNotification = (id) => instance.get(`/notification/${id}`)

export const getUnreadNotification = (id) => instance.get(`/show-unread/${id}`)

export const deleteNotification = (id) => instance.get(`/notification/delete/${id}`)

export const update = (id) => instance.post(`/notification/update/${id}`)

export const updateAllRead = () => instance.post('notification/update_all_read')

