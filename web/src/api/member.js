import axios from './axios'

const getListMember = () => axios.get('/member')
export const MemberApi = {
  getListMember,
}
