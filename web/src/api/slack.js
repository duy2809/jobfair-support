import instance from './axios'

export const createChannel = (name) => instance.get(`/createchannel/${name}`)
export const updateChannelId = (name, channelid) => instance.get(`/updatechannelid/${name}/${channelid}`)
export const addUserToChannel = (argument) => instance.post('/add-user-to-channel/', argument)
export const addAdminToChannel = (argument) => instance.post('/add-admin-to-channel/', argument)
