import axios from './axios'

const getListCategory = () => axios.get('/category')

export const CategoryApi = {
  getListCategory,
}
