import axios from './axios'

export const editTask = (id, argument) => axios.put(`/task/${id}`, argument)
export const getCategorys = () => axios.get('/category-jobfair')
export const reviewers = (id) => axios.get(`/task/${id}/reviewers`)
