import axios from './axios'
<<<<<<< HEAD

const getMemberDetail = (id) => axios.get(`/member/${id}`)
=======
import instance from '~/api/axios'
>>>>>>> 37f3598 (feat: update front-end)
const getListMember = () => axios.get('/member')
const updateMember = (id, req) => axios.patch(`/member/${id}/update`, req)
export const MemberApi = {
  getMemberDetail,
  getListMember,
  updateMember,
}
export const sendInviteLink = (data) => instance.post('/invite-member', data)