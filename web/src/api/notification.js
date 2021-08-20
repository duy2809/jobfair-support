import instance from './axios'

export const getNotification = (id) => instance.get(`/notification/${id}`)

export const getUnreadNotification = (id) => instance.get(`/show-unread/${id}`)

export const deleteNotification = (id) => instance.get(`/notification/delete/${id}`)
<<<<<<< HEAD

export const update = (id) => instance.post(`/notification/update/${id}`)

export const updateAllRead = () => instance.post('notification/update_all_read')
=======
>>>>>>> 59835965a73e584a845592834b6c3821bc20b436
