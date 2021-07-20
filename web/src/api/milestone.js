import axios from './axios'

export const updateMilestone = (id, argument) => axios.put(`/milestone/${id}`, argument)

export const getMilestone = (id) => axios.get(`/milestone/${id}`)
