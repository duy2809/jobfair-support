import axios from './axios'

const getMemberDetail = (id) => axios.get(`/member/${id}`)
const getListMember = () => axios.get('/member')
const updateMember = (id, req) => axios.patch(`/member/${id}/update`, req)
export const MemberApi = {
  getMemberDetail,
  getListMember,
  updateMember,
}
