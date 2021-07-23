import axios from './axios'

const getListShedule = () => axios.get('/schedule')
export const ListScheduleApi = {
  getListShedule,
}
