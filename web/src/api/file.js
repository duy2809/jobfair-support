import instance from './axios'

export const editDocument = async (id, argument) => instance.put(`file/${id}/edit`, argument)
export const getRootPathFile = async (JFid) => instance.get(`/file/${JFid}`)
export const getLatest = async () => instance.get('/file/getLatest')
export const deleteDocument = async (id, argument) => instance.post(`file/${id}/delArray`, argument)
export const getPath = async (argument) => instance.get('file/getPath', argument)
<<<<<<< HEAD
=======
export const getMember = async (id) => instance.get(`${id}/member`)
export const searchFile = async (argument) => instance.get('file/find', argument)
export const addDocument = (agr) => instance.post('/file', agr)
>>>>>>> f653ac57a43d5efce7e8a83caf578734f6c351a0
