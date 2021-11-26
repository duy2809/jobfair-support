import axios from './axios'

export const taskData = (id) => axios.get(`/task/${id}`)
export const beforeTask = (id) => axios.get(`/before-tasks/${id}`)
export const afterTask = (id) => axios.get(`/after-tasks/${id}`)
export const deleteTask = (id) => axios.delete(`/task/${id}`)
export const getUser = () => axios.get('/users')
export const getUserByCategory = (category) => axios.get('/category-member', { params: { category } })
export const checkAssignee = (taskID, userID) => axios.get(`/isAssignee/${taskID}/${userID}`)
export const updateManagerTask = (id, arg) => axios.put(`/updatemanager/${id}`, arg)
export const reviewers = (id) => axios.get(`/task/${id}/reviewers`)
export const getRoleTask =(jobfair_id, user_id, task_id) => axios.get(`/task-role/${jobfair_id}/${user_id}/${task_id}`);
export const updateStatusMember = (user_id, task_id, status) => axios.put(`/update-status/${user_id}/${task_id}?status=${status}`);
