import instance from './axios'

// eslint-disable-next-line no-undef
export const getNewMilestone = (id) => instance.get(`/get-template-tasks/${id}`)
