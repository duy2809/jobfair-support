import axios from './axios'

export const updateMilestone = async (id, argument) => axios.put(`/milestone/${id}`, argument)

export const getMilestone = async (id) => axios.get(`/milestone/${id}`)
