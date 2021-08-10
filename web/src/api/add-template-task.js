import instance from './axios'

const addTemplateTaskAPI = {
  getListTemplateCategories: () => {
    const url = '/categories-template-tasks'
    return instance.get(url)
  },
  getListTemplateMilestone: () => {
    const url = '/milestone'
    return instance.get(url)
  },
  getAllTemplateTasks: () => {
    const url = '/template-tasks'
    return instance.get(url)
  },
  addTemplateTask: (data) => {
    const url = '/template-tasks'
    return instance.post(url, data)
  },
  isTemplateTaskExisted: () => {
    const url = '/is-template-task-existed'
    return instance.get(url)
  },
}
export default addTemplateTaskAPI
