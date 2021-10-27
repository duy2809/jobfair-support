import axios from './axios'

export const editTask = (id, argument) => axios.put(`/task/${id}`, argument)
export const getCategorys = (id) => axios.get(`/jobfair/${id}/category`)
export const reviewers = (id) => axios.get(`/task/${id}/reviewers`)
export const listReviewersSelectTag = (id) => axios.get(`/task/${id}/list-reviewers`)
