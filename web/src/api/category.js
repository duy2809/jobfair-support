import axios from './axios'

export const getCategory = async () => axios.get('/categories')
