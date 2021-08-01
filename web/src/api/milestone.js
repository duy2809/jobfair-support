import instance from './axios'

export const updateMilestone = (id, argument) => instance.put(`/milestone/${id}`, argument)

export const getMilestone = (id) => instance.get(`/milestone/${id}`)

export const addMilestone = (argument) => instance.post('milestone/', argument)
