/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import 'tailwindcss/tailwind.css'
import { Dropdown, List, Avatar, Checkbox } from 'antd'
import { BellOutlined, DeleteTwoTone } from '@ant-design/icons'
import './styles.scss'
import { ReactReduxContext } from 'react-redux'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import NotificationChannel from '../../libs/echo/channels/notification-channel'
import { getNotification, update, updateAllRead, getUnreadNotification, deleteNotification } from '../../api/notification'

export default function Notification() {
  // const [userName, setUserName] = useState([])
  // const [lengthNoti, setLengthNoti] = useState()
<<<<<<< HEAD

  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(store.getState().get('auth').get('user'))
=======
  const [user, setUser] = useState(null)
>>>>>>> push fix redirect after login
  const [unread, setUnRead] = useState(false)
  const [unreadLength, setUnReadLength] = useState(0)
  const [loading, setLoading] = useState(false)
  const [deleteNotiCheck, setDeleteNoti] = useState(0)
  const [checkUpdate, setCheckUpdate] = useState(0)
  const [dataNoti, setDataNoti] = useState([])
  const formatter = buildFormatter(frenchStrings)

  const fetchData = async () => {
    setLoading(true)
    try {
      // setUserName([])
<<<<<<< HEAD
=======
      setDataNoti([])
>>>>>>> push fix redirect after login
      setUser(store.getState().get('auth').get('user'))
      if (user) {
        const id = user.get('id')
        let data
        if (unread) {
          const res = await getUnreadNotification(id)
          if (!res.data) {
            setLoading(false)
            return
          }
          data = res.data
        } else {
          const res = await getNotification(id)
          if (!res.data) {
            setLoading(false)
            return
          }
          data = res.data
        }
        // const length = data.noti.length
        // setLengthNoti(length)
        let countUnreadNoti = 0
        const newNoti = data.map((item) => {
          if (!item.read_at) {
            countUnreadNoti += 1
          }

          let action
          let userid
          let url
          if (item.type === 'App\\Notifications\\JobfairEdited') {
            action = `${item.data.user.name}さんが${item.data.jobfair.name}JFを編集しました。`
            userid = item.data.user.id
            url = `/jf-toppage/${item.data.jobfair.id}`
          } else if (item.type === 'App\\Notifications\\JobfairCreated') {
            action = `${item.data.jobfair.name}JFの管理者に選ばれました。`
            userid = item.data.user.id
            url = `/jf-toppage/${item.data.jobfair.id}`
          } else if (item.type === 'App\\Notifications\\MemberEdited') {
            action = `${item.data.edited_user.name}さんが${user.get('name')}メンバを編集しました。`
            userid = item.data.edited_user.id
            url = `/member/${id}`
          } else if (item.type === 'App\\Notifications\\TaskCreated') {
            action = `${item.data.task.name}タスクの責任者に選ばれました。`
            userid = item.data.user.id
            url = `/task-detail/${item.data.task.id}`
          } else if (item.type === 'App\\Notifications\\TaskEdited') {
            action = `${item.data.user.name}さんが${item.data.jobfair.name}JFに${item.data.task.name}タスクを編集しました。`
            userid = item.data.user.id
            url = `/task-detail/${item.data.task.id}`
          } else if (item.type === 'App\\Notifications\\TaskExpired') {
            action = `タスク${item.task.name}が完了期限を過ぎました。`
            userid = item.data.user.id
            url = `/task-detail/${item.data.task.id}`
          }
          const newItem = {
            ...item, action, avatar: `/api/avatar/${userid}`, url,
          }

          return newItem
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setUnReadLength(countUnreadNoti)
        setDataNoti(newNoti)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

<<<<<<< HEAD
  // TODO: fix bug crash browser
  useEffect(() => {
    new NotificationChannel(store.getState().get('auth').get('user').get('id'))
      .onOutput((data) => {
        let action
        let userid
        let url
        if (data.type === 'App\\Notifications\\JobfairEdited') {
          action = `${data.user.name}さんが${data.jobfair.name}JFを編集しました。`
          userid = data.user.id
          url = `/jf-toppage/${data.jobfair.id}`
        } else if (data.type === 'App\\Notifications\\JobfairCreated') {
          action = `${data.jobfair.name}JFの管理者に選ばれました。`
          userid = data.user.id
          url = `/jf-toppage/${data.jobfair.id}`
        } else if (data.type === 'App\\Notifications\\MemberEdited') {
          action = `${data.edited_user.name}さんが${user.get('name')}メンバを編集しました。`
          userid = data.edited_user.id
          url = `/member/${user.get('id')}`
        } else if (data.type === 'App\\Notifications\\TaskCreated') {
          action = `${data.task.name}タスクの責任者に選ばれました。`
          userid = data.user.id
          url = `/task-detail/${data.task.id}`
        } else if (data.type === 'App\\Notifications\\TaskEdited') {
          action = `${data.user.name}さんが${data.jobfair.name}JFに${data.task.name}タスクを編集しました。`
          userid = data.user.id
          url = `/task-detail/${data.task.id}`
        } else if (data.type === 'App\\Notifications\\TaskExpired') {
          action = `タスク${data.task.name}が完了期限を過ぎました。`
          userid = data.user.id
          url = `/task-detail/${data.task.id}`
        }

        const date = new Date()
        const isoDateTime = new Date(date.getTime()).toISOString()

        const newItem = {
          action, avatar: `/api/avatar/${userid}`, url, created_at: isoDateTime, read_at: null,
        }
        setUnReadLength((prev) => prev + 1)
        setDataNoti((prev) => [newItem, ...prev])
      })
      .listen()
  }, [user])

  // if (user) {
  //   const id = user.get('id')
  //   getUnreadNotification(id).then((res) => {
  //     if (!res.data) {
  //       setUnReadLength(0)
  //     } else {
  //       setUnReadLength(res.data.noti.length)
  //     }
  //   })
  // }
=======
  if (user) {
    const id = user.get('id')
    getUnreadNotification(id).then((res) => {
      if (!res.data) {
        setUnReadLength(0)
      } else {
        setUnReadLength(res.data.noti.length)
      }
    })
  }
>>>>>>> push fix redirect after login

  useEffect(() => {
    fetchData()
  }, [deleteNotiCheck, unread, user, checkUpdate])

  function onChangeUnread(e) {
    if (e.target.checked) {
      setUnRead(true)
    } else {
      setUnRead(false)
    }
  }

  // const getNoti = (value) => {
  //   console.log(value)
  // }

  // change ...
  // function handleChange(value) {
  //   console.log(`Selected: ${value}`)
  //   getNoti(value)
  // }

  // show noti
  const [visible, setVisible] = useState(false)

  const handleVisibleChange = () => {
    setVisible(!visible)
  }
  const deleteNoti = (notiId) => {
    // console.log(noti_id)
    // setDeleteNoti(noti_id)
    // console.log(deleteNotiID)
    deleteNotification(notiId).then((res) => {
      if (res.data == null) {
        return
      }
      setDeleteNoti(deleteNotiCheck + 1)
    })
  }

  const updateReadAt = (id) => {
    update(id).then((res) => {
      if (res.data == null) {
        return
      }
      setCheckUpdate(checkUpdate + 1)
    })
  }

  const onChange = () => {
<<<<<<< HEAD
    updateAllRead(user.get('id')).then((res) => {
=======
    updateAllRead().then((res) => {
>>>>>>> push fix redirect after login
      if (res.data == null) {
        return
      }
      setCheckUpdate(checkUpdate + 1)
      setUnReadLength(0)
    })
  }

  const handlerClick = (type, id) => {
    if (type === 'タスク') {
      window.location.href = `/task-detail/${id}`
    }
    if (type === 'メンバ') {
      window.location.href = `/member/${id}`
    }
    if (type === 'JF') {
      window.location.href = `/jf-toppage/${id}`
    }
  }

  // const convertDate = (date) => {
  //   const currentdate = new Date(date)
  //   const hours = currentdate.getUTCHours()
  //   const datetime = `${currentdate.getFullYear()}-${currentdate.getMonth() + 1
  //     }-${currentdate.getDate()} `
  //     + `${hours > 12
  //       ? `${hours - 12}:${currentdate.getMinutes()}PM`
  //       : `${hours}:${currentdate.getMinutes()}AM`
  //     }`
  //   return datetime
  // }

  const notifications = (
    <div className="notification border-2 rounded-2xl bg-white">
      <List
        size="small"
        header={(
          <div className="noti-header">
            <div className="noti-title">通知</div>
            <div className="noti-space" />
            <div className="noti-checked">
              <Checkbox onChange={onChangeUnread}>未読のみ表示</Checkbox>
            </div>
          </div>
        )}
        footer={(
          <div className="noti-footer">
            <Checkbox className="" onChange={onChange}>
              すべて既読にする
            </Checkbox>
          </div>
        )}
        dataSource={dataNoti}
        loading={loading}
        locale={{
          emptyText: `${unread ? '未読の通知はありません' : '通知なし'}`,
        }}
        renderItem={(item) => (
          <List.Item className={!item.read_at ? 'bg-gray-300' : 'bg-white'}>
            {!loading && (
              <div className="flex flex-cols">
                <div className="noti-list-item">
                  <List.Item.Meta
                    onClick={() => {
                      if (!item.read_at) {
                        updateReadAt(item.id)
                      }
                      handlerClick(item.url)
                    }}
                    avatar={<Avatar src={item.avatar} />}
                    title={(
                      <div>

                        {item.action}

                      </div>
                    )}
                    description={<TimeAgo date={item.created_at} formatter={formatter} />}
                  />
                  {/* <div className="noti-time">
                      {convertDate(item.created_at)}
                    </div> */}
                </div>
                <div className="delete-btn" style={{ marginLeft: '10px' }}>
                  <DeleteTwoTone onClick={() => deleteNoti(item.id)} />
                </div>
              </div>
            )}
          </List.Item>
        )}
      />
    </div>
  )

  return (
    <Dropdown
      overlay={notifications}
      onVisibleChange={handleVisibleChange}
      trigger={['click']}
      visible={visible}
      placement="bottomCenter"
    >
      <div className="bell-icon-container">
        <BellOutlined className="bell-icon" />
        {/* <span className="number-notifications">{unreadLength}</span> */}
        <span className="number-notifications">{unreadLength}</span>
      </div>
    </Dropdown>
  )
}
