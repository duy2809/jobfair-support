import axios from './axios'

export const jfdata = (id) => axios.get(`/jobfair/${id}`)
export const jftask = (id) => axios.get(`/jobfair/${id}/tasks`)
export const listmilestone = (id) => axios.get(`/jobfair/${id}/milestones`)
export const listupdate = (id) => axios.get(`/jobfair/${id}/updated-tasks`)
// axios.get('/jobfair/1')
