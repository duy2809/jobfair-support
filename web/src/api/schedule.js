import axios from './axios'

const getListShedule = () => axios.get('/schedule')

const searchListShedule = (params) => axios.get('/search', { params })

const getGanttChart = (id) => axios.get(`/schedule/${id}/gantt`)
export const ListScheduleApi = {
  getListShedule,
  searchListShedule,
  getGanttChart,
}
