import instance from './axios'

export const addComment = (payload) => instance.post('/comment', payload)
export const getComments = (taskId, start, count) => instance.get(`/show-more-comment/${taskId}?start=${start}&count=${count}`)
