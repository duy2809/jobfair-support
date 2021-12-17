import instance from './axios'

// eslint-disable-next-line no-undef
export const getNewMilestone = (id) => instance.get(`/get-template-tasks/${id}`)
export const updateParent = (data) => instance.put('/update-parent-template-tasks', data)
