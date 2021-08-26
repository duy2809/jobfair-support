import instance from './axios'

export const editDocument = async (id, argument) => instance.put(`file/${id}/edit`, argument)
export const getRootPathFile = async (JFid) => instance.get(`/file/${JFid}`)
export const getLatest = async () => instance.get('/file/getLatest')
export const deleteDocument = async (id, argument) => instance.post(`file/${id}/delArray`, argument)
export const getPath = async (argument) => instance.get('file/getPath', argument)
