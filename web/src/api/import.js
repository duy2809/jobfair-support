import instance from '~/api/axios'

export const sentFile = (data) => instance.post('/file-import', data)
