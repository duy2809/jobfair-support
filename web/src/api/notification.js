import instance from './axios'

export const getNotification = (id) => instance.get(`/notification/${id}`)

<<<<<<< HEAD
export const getUnreadNotification = (id) => instance.get(`/show-unread/${id}`)

export const deleteNotification = (id) => instance.get(`/notification/delete/${id}`)
=======
>>>>>>> 05bbfadd7da818beec6ea26cbee5492b197e4231
