import axios from './axios'

export const editTask = (id, argument) => axios.put(`/task/${id}`, argument)
