import instance from './axios'

export const getTaskByJfId = (id) => instance.get(`/kanban/${id}`)
export const updateTask = (id, arg) => instance.put(`/kanban/updateTask/${id}`, arg)
