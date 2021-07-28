import axios from './axios'

export const getJFList = () => axios.get('/jf-list')
export const deleteJFList = async (id) => axios.get(`/jf-list/delete/${id}`)