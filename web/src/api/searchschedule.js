import axios from './axios'

const SearchListShedule = () => axios.get('/search')
export const SearchListScheduleApi = {
  SearchListShedule,
}
