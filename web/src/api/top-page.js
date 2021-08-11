import axios from 'axios'

export const tasks = () => axios.get('/api/top-page/tasks')
export const members = () => axios.get('/api/top-page/members')
export const jobfairs = () => axios.get('/api/top-page/jobfairs')
