import React from 'react'
import { Avatar, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import 'antd/dist/antd.css'
import { getAvatar } from '../../api/profile'

const AvatarKanban = ({ user }) => (
  <Avatar.Group maxCount={4}>
    {user.map(async (el, id) => {
      const { uName, userId } = el
      let avatarUser = null
      await getAvatar(userId)
        .then((res) => {
          if (!res.data) {
            avatarUser = null
          } else {
            console.log(id)
            const link = `../../api/avatar/${userId}`
            avatarUser = link
          }
        })
        .catch((error) => {
          console.log(error)
          avatarUser = null
        })
      return avatarUser ? (
        <Tooltip key={id.toString()} placement="bottom" title={<p>{uName}</p>}>
          <Avatar src={avatarUser} />
        </Tooltip>
      ) : (
        <Tooltip key={id.toString()} placement="bottom" title={<p>{uName}</p>}>
          <Avatar src="../images/avatars/default.jpg" />
        </Tooltip>
      )
    })}
  </Avatar.Group>
)
AvatarKanban.propTypes = {
  user: PropTypes.array.isRequired,
}

export default AvatarKanban
