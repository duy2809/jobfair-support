import axios from './axios'

export const postComment = (id) => axios.post(`/task/${id}`)
export const getComments = (taskId, start, count) => axios.get(`/show-more-comment/${taskId}?start=${start}&count=${count}`)
