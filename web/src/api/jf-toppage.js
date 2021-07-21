import axios from './axios'

export const jfdata = () => axios.get('/jobfair/11')
export const jftask = () => axios.get('/jobfair/11/tasks')
export const listmilestone = () => axios.get('/jobfair/11/milestones')
export const listupdate = () => axios.get('/jobfair/11/updated-tasks')

// axios.get('/jobfair/1')
