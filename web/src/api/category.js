import instance from './axios'

export const getCategories = async () => instance.get('/category')
export const searchCategory = async (key) => instance.get(`/category/find/${key}`)
export const getCategory = async (id) => instance.get(`category/${id}`)
export const updateCategory = async (id, argument) => instance.put(`/category/${id}`, argument)
export const addCategory = async (argument) => instance.post('/category', argument)
export const deleteCategory = async (id) => instance.delete(`category/${id}`)
const getListCategory = () => instance.get('/category')

export const CategoryApi = {
  getListCategory,
}
