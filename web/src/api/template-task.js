import axios from './axios'

export const templateTask = (id) => axios.get(`/template-tasks/${id}`)
export const beforeTask = (id) => axios.get(`/before-template-tasks/${id}`)
export const afterTask = (id) => axios.get(`/after-template-tasks/${id}`)
export const deleteTptt = (id) => axios.delete(`/template-tasks/${id}`)
