/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import 'tailwindcss/tailwind.css'
import { Dropdown, List, Avatar, Checkbox } from 'antd'
import { BellOutlined, DeleteTwoTone } from '@ant-design/icons'
import './styles.scss'
import { ReactReduxContext } from 'react-redux'
import {
  getNotification,
  update,
  updateAllRead,
  getUnreadNotification,
  deleteNotification,
} from '../../api/notification'

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

  useEffect(() => {
    new NotificationChannel(store.getState().get('auth').get('user').get('id'))
      .onOutput((data) => {
        console.log(data)
      })
      .listen()
  }, [])

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
        const newNoti = data.noti
          .map((item, idx) => {
            const newItem = {
              ...item,
              ...data.userName[idx],
              taskName: `${data.taskName[idx].name}`,
              avatar: `/api/avatar/${item.user_id}`,
            }
            return newItem
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setDataNoti(newNoti)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

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

  const convertDate = (date) => {
    const currentdate = new Date(date)
    const hours = currentdate.getUTCHours()
    const datetime = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate()} `
      + `${
        hours > 12
          ? `${hours - 12}:${currentdate.getMinutes()}PM`
          : `${hours}:${currentdate.getMinutes()}AM`
      }`
    return datetime
  }

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
                      handlerClick(item.type, item.subjectable_id)
                    }}
                    avatar={<Avatar src={item.avatar} />}
                    title={(
                      <div>
                        {item.name}
                        さんが
                        {item.taskName}
                        {item.type}
                        を
                        {item.data}
                        しました
                      </div>
                    )}
                    description={convertDate(item.created_at)}
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
        <span className="number-notifications">100</span>
      </div>
    </Dropdown>
  )
}
