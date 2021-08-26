import axios from './axios'

const getListSchedule = () => axios.get('/schedule')

const searchListSchedule = (params) => axios.get('/search', { params })

export const ListScheduleApi = {
  getListSchedule,
  searchListSchedule,
}
