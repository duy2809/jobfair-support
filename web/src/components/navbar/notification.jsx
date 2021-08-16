import React, {useState, useEffect, useContext} from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, List, Avatar, Select, Checkbox, Button, Tooltip } from 'antd'
import { CaretDownOutlined, BellFilled, UserOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from 'next/link'
import './styles.scss'

import moment from 'moment';
import { getNotification } from '../../api/notification'
import { getProfile, getAvatar } from '../../api/profile'

import { ReactReduxContext } from 'react-redux'


export default function Notification() {
  const [userId, setUserId] = useState([])
  const [userName, setUserName] = useState([])

  const [lengthNoti, setLengthNoti] = useState()
  const [type, setType] = useState([])
  const [data_noti, setData] = useState([])
  const [read_at, setReadAt] = useState([])
  const [created_at, setCreatedAt] = useState([])
  const [avatarUser, setAvatarUser] = useState([])

  const [user, setUser] = useState(null)
  const { store } = useContext(ReactReduxContext)


  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      const id = user.get('id')
      getNotification(id).then((response) => {
        const length = response.data.noti.length
        setLengthNoti(length)
        console.log(response.data.noti)
        console.log(response.data.noti[0].data)
        for (let i = 0; i < length; i++) {
          setUserName(userName => [...userName, response.data.userName[i].name]);
          setUserId(userId => [...userId, response.data.noti[i].user_id]);
          setData(data_noti => [...data_noti, response.data.noti[i].data]);

          setType(type => [...type, response.data.noti[i].type]);
          
        }
      })
    }
  }, [user])



  //get noti
  const data = []
  // console.log(userId[0])
  // console.log('test')
  for (let i = 0; i < lengthNoti; i++) {
    // console.log(userName[i])
    
    // getProfile(userId[i]).then((response) => {
    //   data[i]= {'nameUser' : response.data.name}
    // })
    // getAvatar(userId[i]).then(() => {
      const link = `/api/avatar/${userId[i]}`
      // const link = '/images/logo.png'
      data[i]= {'avatarLink' : link,'type' : type[i], 'name' : userName[i], 'data': data_noti[i]}

    // })
    // data[i]= {'type' : type[i]}
    // console.log(data)
    
  }
  // console.log(data)
  // const data = [
  //   {
  //     'name' : 'a-san',
  //     'action': 'add JF',
  //     'time': '11:12:20',
  //   },
  //   {
  //     'name' : 'a',
  //     'action': 'add JF',
  //     'time': '11:12:20',
  //   },
  //   {
  //     'name' : 'a',
  //     'action': 'add JF',
  //     'time': '11:12:20',
  //   },
  //   {
  //     'name' : 'a-san',
  //     'action': 'add JF',
  //     'time': '11:12:20',
  //   },
  //   {
  //     'name' : 'a-san',
  //     'action': 'add JF',
  //     'time': '11:12:20',
  //   },
  // ];


  //get user's noti
  const getNoti = (value) => {
    console.log(value);
  }
  
  //change ...
  function handleChange(value) {
    console.log(`Selected: ${value}`);
    getNoti(value);
  }

  // choose noti unread
  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  // show noti
  const [visible, setVisible] = useState(false)

  const handleVisibleChange = () => {
    setVisible(!visible);
  };

  const notifications = (
    <div className="notification w-96 border-2 rounded-2xl bg-white">
      <List
      size="small"
      header={
        <div className="noti-header">
          <div className="noti-title">通知</div>   
          <div className="noti-space"></div>    
          <div className='noti-checked'>
           <Checkbox  onChange={onChange}>未読のみ表示</Checkbox>
          </div>   
         
        </div>
      }
      footer={
        <div className='noti-footer'>
          <Checkbox className='' onChange={onChange}>すべて既読にする</Checkbox>
        </div>
      }
      bordered
      dataSource={data}
      locale = {{'emptyText': 'No Notification'}}
      renderItem={item =>  <List.Item>
          <div className="noti-list-item">
            <List.Item.Meta
            avatar={<Avatar src={item.avatarLink}/>}
            title={<div>{item.name} {item.data} {item.type}  </div>}
            />
            <div className="noti-time">
              2021-07-30 4:00 PM
            </div>
            
          </div>  
          <div className="delete-btn">
              <Button
              type="link"
              icon={<DeleteOutlined />}
              />
          </div>  
      </List.Item>}
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
                {data.length}
              </span>
            </div>
        </Dropdown>
    </div>
  )
}