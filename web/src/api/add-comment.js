import axios from './axios'

export const postComment = (id) => axios.post(`/task/${id}`)
