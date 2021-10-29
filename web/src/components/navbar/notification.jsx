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
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [unread, setUnRead] = useState(false)
  const [unreadLength, setUnReadLength] = useState(0)
  const { store } = useContext(ReactReduxContext)
  const [loading, setLoading] = useState(false)
  const [deleteNotiCheck, setDeleteNoti] = useState(0)
  const [checkUpdate, setCheckUpdate] = useState(0)
  const [dataNoti, setDataNoti] = useState([])
  const formatter = buildFormatter(frenchStrings)

  const fetchData = async () => {
    setLoading(true)
    try {
      setDataNoti([])
      setUser(store.getState().get('auth').get('user'))
      if (user) {
        const id = user.get('id')
        setUserId(id)
        let data
        if (unread) {
          const res = await getUnreadNotification(id)
          if (!res.data) {
            setLoading(false)
            return
          } data = res.data
        } else {
          const res = await getNotification(id)
          if (!res.data) {
            setLoading(false)
            return
          } data = res.data
        }
        const newNoti = data.map((item) => {
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

        setDataNoti(newNoti)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    new NotificationChannel(store.getState().get('auth').get('user').get('id'))
      .onOutput((data) => {
        // TODO: only add new notification to state
        console.log(data)
        fetchData()
      })
      .listen()
  }, [])

  if (user) {
    const id = user.get('id')
    getUnreadNotification(id).then((res) => {
      if (!res.data) {
        setUnReadLength(0)
      } else {
        setUnReadLength(res.data.length)
      }
    })
  }

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

  const [visible, setVisible] = useState(false)

  const handleVisibleChange = () => {
    setVisible(!visible)
  }
  const deleteNoti = (notiId) => {
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
    updateAllRead(userId).then((res) => {
      if (res.data == null) {
        return
      }
      setCheckUpdate(checkUpdate + 1)
    })
  }

  const handlerClick = (url) => {
    window.location.href = url
  }

  // const convertDate = (date) => {
  //   const currentdate = new Date(date)
  //   const hours = currentdate.getUTCHours()
  //   const datetime = `${currentdate.getFullYear()}-${currentdate.getMonth() + 1}-${currentdate.getDate()} `
  //     + `${hours > 12 ? `${hours - 12}:${currentdate.getMinutes()}PM` : `${hours}:${currentdate.getMinutes()}AM`}`
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
            <Checkbox
              className=""
              onChange={onChange}
            >
              すべて既読にする
            </Checkbox>
          </div>
        )}
        dataSource={dataNoti}
        loading={loading}
        locale={{ emptyText: `${unread ? '未読の通知はありません' : '通知なし'}` }}
        renderItem={(item) => (
          <List.Item
            className={!item.read_at ? 'bg-gray-300' : 'bg-white'}
          >
            {
              !loading && (
                <div
                  className="flex flex-cols"
                >
                  <div
                    className="noti-list-item"
                  >
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
                  <div
                    className="delete-btn"
                    style={{ marginLeft: '10px' }}
                  >
                    <DeleteTwoTone
                      onClick={() => deleteNoti(item.id)}
                    />
                  </div>
                </div>

              )
            }

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
      <div className="mt-5 px-4 cursor-pointer">
        <BellOutlined className="text-3xl bell-icon relative bottom-0.25" />
        <span className="relative w-5 h-5 rounded-full -top-9 -right-4 flex number-notifications justify-center items-center text-center">
          {unreadLength}
        </span>
      </div>

    </Dropdown>
  )
}
