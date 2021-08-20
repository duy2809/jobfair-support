import instance from '~/api/axios'

const getMemberDetail = (id) => instance.get(`/member/${id}`)
const getListMember = () => instance.get('/member')
const updateMember = (id, req) => instance.patch(`/member/${id}/update`, req)
export const MemberApi = {
  getMemberDetail,
  getListMember,
  updateMember,
}
export const sendInviteLink = (data) => instance.post('/invite-member', data)
