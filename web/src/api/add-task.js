import instance from './axios'

const addTemplateTaskAPI = {
  getMilestones: () => {
    const url = '/milestone'

    return instance.get(url)
  },
  getJobfair: (id) => {
    const url = `/jobfair/${id}`
    return instance.get(url)
  },
  getCategories: () => {
    const url = '/categories-template-tasks'
    return instance.get(url)
  },
  getAllTemplateTasks: () => {
    const url = '/template-tasks'
    return instance.get(url)
  },
  addTasks: (data) => {
    const url = '/add-task'
    return instance.post(url, data)
  },
//   isTemplateTaskExisted: (data) => {
//     const url = '/is-template-task-existed'
//     return instance.post(url, data)
//   },
}
export default addTemplateTaskAPI
