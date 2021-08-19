import instance from './axios';

export const getSchedule = (id) => instance.get(`/schedules/${id}`);
export const getMilestonesList = (id) => instance.get(`/schedules/${id}/all-milestones/`);
export const getTemplateTaskList = (id) => instance.get(`/schedules/${id}/all-template-tasks/`);
export const getAddedMilestonesList = (id) => instance.get(`/schedules/${id}/added-milestones/`);
export const getAddedTemplateTaskList = (id) => instance.get(`/schedules/${id}/added-template-tasks/`);
export const putData = (id, argument) => instance.put(`/schedules/${id}/`, argument);
export const postData = (id, argument) => instance.post(`/schedules/${id}/`, argument);
export const postCheckExistName = (id, argument) => instance.post(`/schedules/${id}/checkScheduleNameExist`, argument);
