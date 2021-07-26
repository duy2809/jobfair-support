import axios from './axios'

export const getCategory = async () => axios.get('/categories')
export const searchCategory = async (key) => axios.get(`/categories/${key}`)
