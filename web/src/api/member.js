import axios from './axios'

const getListMember = (params) => axios.get('/member', {params})
export const MemberApi = {
  getListMember,
}
