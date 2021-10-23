import instance from './axios'

const addJFAPI = {
  getSchedule: () => {
    const url = '/schedules'
    return instance.get(url)
    // expect result
    // "data": [
    // {
    //     "id": 7,
    //     "name": "Marilou Mitchell",
    //     "jobfair_id": null
    // },
    // ]
  },

  getTaskList: (id) => {
    const url = `/schedules/${id}/template-tasks`
    return instance.get(url)
  },
  getMilestone: (id) => {
    const url = `/schedules/${id}/milestones`
    return instance.get(url)
  },
  getAdmin: () => {
    const url = '/admins'
    return instance.get(url)
  },
  addJF: (data) => {
    const url = '/jobfair'
    return instance.post(url, data)
  },
  isJFExisted: (name) => {
    const url = '/is-jf-existed/'
    return instance.post(url, name)
  },
  multiRequest: (requests) => instance.all(requests),
}
export default addJFAPI
