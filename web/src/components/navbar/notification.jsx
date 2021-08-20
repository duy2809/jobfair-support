import React, {useState, useEffect, useContext} from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, List, Avatar, Select, Checkbox, Button, Tooltip,Spin } from 'antd'
import { CaretDownOutlined, BellFilled, UserOutlined, CloseOutlined, DeleteOutlined, DeleteTwoTone } from '@ant-design/icons'
import Link from 'next/link'
import './styles.scss'

import moment from 'moment';
import { getNotification, update, updateAllRead } from '../../api/notification'
import { getUnreadNotification, deleteNotification } from '../../api/notification'


import { ReactReduxContext } from 'react-redux'


export default function Notification() {
  // const [userName, setUserName] = useState([])
  // const [lengthNoti, setLengthNoti] = useState()
  const [user, setUser] = useState(null)
  const [unread, setUnRead] = useState(false)
  const [unreadLength, setUnReadLength] = useState(0)
  const { store } = useContext(ReactReduxContext)
  const [loading, setLoading] = useState(false)
  const [deleteNotiCheck, setDeleteNoti] = useState(0)
  const [checkUpdate, setCheckUpdate] = useState(0)
  const [dataNoti, setDataNoti] = useState([])

  const fetchData = async () => {
    setLoading(true)
    try {
      // setUserName([])
      setDataNoti([])
      setUser(store.getState().get('auth').get('user'))
      if (user) {
        const id = user.get('id')
        let data;
        if (unread) {
          const res = await getUnreadNotification(id)
          if(!res.data) {
            setLoading(false)
            return
          } else data = res.data
          
        } else {
          const res = await getNotification(id)
          if(!res.data) {
            setLoading(false)
            return
          } else data = res.data
        }
        // const length = data.noti.length
        // setLengthNoti(length)
        const newNoti = data.noti.map((item, idx) => {
          const newItem = {...item, ...data.userName[idx], avatar: `/api/avatar/${item.user_id}`}
          return newItem 
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setDataNoti(newNoti)
        setLoading(false)
      }
    }catch (err) {
      console.error(err)
    }
  }

  if (user) {
    const id = user.get('id')
    getUnreadNotification(id).then((res) => {
    if(res.data == 0){
      setUnReadLength(0)
    }else{
      setUnReadLength(res.data.noti.length)
    }
  })
}

  useEffect(() => {
    fetchData()
  }, [deleteNotiCheck,unread,user, checkUpdate])
    
  
useEffect(() => {
  console.log(store.getState().get('auth').get('user').get('id'))
}, [])
  function onChangeUnread(e) {
      if(e.target.checked){
        setUnRead(true)
      }else{
        setUnRead(false)
      }
      
    }
    
  const getNoti = (value) => {
    console.log(value);
  }
  
  //change ...
  function handleChange(value) {
    console.log(`Selected: ${value}`);
    getNoti(value);
  }

  

  // show noti
  const [visible, setVisible] = useState(false)

  const handleVisibleChange = () => {
    setVisible(!visible);
  };
  const deleteNoti = (noti_id) => {
    // console.log(noti_id)
    // setDeleteNoti(noti_id)
    // console.log(deleteNotiID)
    deleteNotification(noti_id).then((res)=>{
      if(res.data == null){
      }
      setDeleteNoti(deleteNotiCheck+1)
    })
    
  
  }
  
  const updateReadAt = (id) => {
    update(id).then(res => {
      if(res.data == null){
      }
      setCheckUpdate(checkUpdate + 1)
    })
  }

  const onChange = () => {
    updateAllRead().then(res => {
      if(res.data == null){
      }
      setCheckUpdate(checkUpdate + 1)
    })
  }

  const convertDate = (date) => {
  console.log(date)
  const currentdate = new Date(date)
  const hours = currentdate.getUTCHours()
  const datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + `${hours > 12 ? hours - 12 + ":" + currentdate.getMinutes() + "PM" : hours + ":" + currentdate.getMinutes() + "AM"}`
  return datetime
  }

  const notifications = (
    <div className="notification border-2 rounded-2xl bg-white">
      <List
      size="small"
      header={
        <div className="noti-header">
          <div className="noti-title">通知</div>   
          <div className="noti-space"></div>    
          <div className='noti-checked'>
           <Checkbox  onChange={onChangeUnread}>未読のみ表示</Checkbox>
          </div>   
         
        </div>
      }
      footer={
        <div className='noti-footer'>
          <Checkbox 
            className='' 
            onChange={onChange}
            >すべて既読にする</Checkbox>
        </div>
      } 
      dataSource={dataNoti}
      loading={loading}
      locale = {{emptyText: 'No Notification'}}
      renderItem={item => 
       <List.Item  
      className={!item.read_at ? 'bg-gray-300' : 'bg-white'}
      // extra={<Button size="small">Delete</Button>}
      >
          {
            !loading && (
              <div 
                className = "flex flex-cols"
              >
                <div 
                className="noti-list-item"
                >
                <List.Item.Meta
                onClick={() => {if(!item.read_at) {
                                updateReadAt(item.id)}}}
                avatar={<Avatar src={item.avatar}/>}
                title={<div>{item.name}さんが{item.type}を{item.data}しました</div>}
                />
                <div className="noti-time">
                  {convertDate(item.created_at)}
                </div>
                
                </div>
                <div 
                className="delete-btn"
                style={{margin: 0 }}
                  >  
                <DeleteTwoTone 
                  onClick={() => deleteNoti(item.id)}
                  />
                </div>
              </div>

            )}

      </List.Item>
      }
      
      />
    </div>
  )

  return (
        <Dropdown 
          overlay={notifications} 
          onVisibleChange={handleVisibleChange}
          trigger={['click']}
          visible={visible} 
          placement="bottomCenter">
            <div className="cursor-pointer">
              <BellFilled className="text-3xl bell-icon relative bottom-0.5" />
              <span className="relative text-lg number-notifications -top-2 right-2">
                {unreadLength}
              </span>
            </div>
        </Dropdown>
  )
}
