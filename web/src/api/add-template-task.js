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

}
export default addTemplateTaskAPI
