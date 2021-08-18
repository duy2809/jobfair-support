import React, {useState, useEffect, useContext} from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, List, Avatar, Select, Checkbox, Button, Tooltip,Spin } from 'antd'
import { CaretDownOutlined, BellFilled, UserOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from 'next/link'
import './styles.scss'

import moment from 'moment';
import { getNotification } from '../../api/notification'
import { getUnreadNotification, deleteNotification } from '../../api/notification'


import { ReactReduxContext } from 'react-redux'


export default function Notification() {
  const [userId, setUserId] = useState([])
  const [userName, setUserName] = useState([])

  const [lengthNoti, setLengthNoti] = useState()
  const [notiId, setNotiId] = useState([])

  const [type, setType] = useState([])
  const [data_noti, setData] = useState([])
  const [read_at, setReadAt] = useState([])
  const [created_at, setCreatedAt] = useState([])
  const [avatarUser, setAvatarUser] = useState([])

  const [user, setUser] = useState(null)
  const [unread, setUnRead] = useState(false)
  const [unreadLength, setUnReadLength] = useState(0)
  const { store } = useContext(ReactReduxContext)

  const [loading, setLoading] = useState(false)
  const [deleteNotiCheck, setDeleteNoti] = useState(0)


  
 
  const data = []
  useEffect(() => {
    setUserName([])
    setUserId([])
    setData([])
    setReadAt([])
    setCreatedAt([])
    setType([])
    setNotiId([])

    setUser(store.getState().get('auth').get('user'))
    if (user) {
      const id = user.get('id')
      if (unread) {
        setLoading(true);
        getUnreadNotification(id).then((response) => {
          if(response.data == 0){
  
          }else{
            const length = response.data.noti.length
            setLengthNoti(length)
            for (let i = 0; i < length; i++) {
              setUserName(userName => [...userName, response.data.userName[i].name]);
              setUserId(userId => [...userId, response.data.noti[i].user_id]);
              setData(data_noti => [...data_noti, response.data.noti[i].data]);
              setReadAt(read_at => [...read_at, response.data.noti[i].read_at]);
              setCreatedAt(created_at => [...created_at, response.data.noti[i].created_at]);
              setType(type => [...type, response.data.noti[i].type]);
              setNotiId(notiId => [...notiId, response.data.noti[i].id]);
            }
          }
          setLoading(false);
        })
  
      } else {
        setLoading(true);
        getNotification(id).then((response) => {
          if(response.data == 0){
  
          }else{
            const length = response.data.noti.length
            setLengthNoti(length)
            for (let i = 0; i < length; i++) {
              setUserName(userName => [...userName, response.data.userName[i].name]);
              setUserId(userId => [...userId, response.data.noti[i].user_id]);
              setData(data_noti => [...data_noti, response.data.noti[i].data]);
              setReadAt(read_at => [...read_at, response.data.noti[i].read_at]);
              setCreatedAt(created_at => [...created_at, response.data.noti[i].created_at]);
              setType(type => [...type, response.data.noti[i].type]);
              setNotiId(notiId => [...notiId, response.data.noti[i].id]);

              
              
            }
          }
          setLoading(false);
        })
      }
      console.log(userName)
      
    }
    console.log(123)
  }, [deleteNotiCheck,unread,user])
  
  
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
  
  //get noti
  for (let i = 0; i < lengthNoti; i++) {
    const link = `/api/avatar/${userId[i]}`
    if (read_at[i] == null) {
      data[i]= {'noti_id':notiId[i],'avatarLink' : link,'type' : type[i], 'name' : userName[i], 'data': data_noti[i], 'created_at': created_at[i], 'read_at': false}
      
    } else {
      data[i]= {'noti_id':notiId[i],'avatarLink' : link,'type' : type[i], 'name' : userName[i], 'data': data_noti[i], 'created_at': created_at[i], 'read_at': true}
      
    }

  
}
  
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
  

  const notifications = (
    <div className="notification w-96 border-2 rounded-2xl bg-white">
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
            // onChange={onChange}
            >すべて既読にする</Checkbox>
        </div>
      }
      bordered
      dataSource={data}
      loading={loading}
      locale = {{emptyText: 'No Notification'}}
      renderItem={item => 
       <List.Item  
      className={!item.read_at ? 'bg-gray-300' : 'bg-white'}
      // extra={<Button size="small">Delete</Button>}
      >

         
          {
            !loading ? (
              <div 
                className = "flex flex-row"
              >
                <div 
                className="noti-list-item"
                >
                <List.Item.Meta
                avatar={<Avatar src={item.avatarLink}/>}
                title={<div>{item.name}さんが{item.type}を{item.data}しました</div>}
                />
                <div className="noti-time">
                  {item.created_at}
                </div>
                
                </div>  
                <div 
                  className="delete-btn"
                  style={{margin: 0 }}
                  >
                    <Button
                    // className="justify-center"
                    // value={item.noti_id}
                    type="link"
                    onClick={()=>deleteNoti(item.noti_id)}
                    icon={<DeleteOutlined />}
                    />
                </div>
              </div>

            ):(<div></div>)}

      </List.Item>
      }
      
      />
    </div>
      

             

  )

  return (
    <div className="px-4 px">
        <Dropdown overlay={notifications} 
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
    </div>
  )
}