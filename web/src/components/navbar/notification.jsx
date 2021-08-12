import React, {useState, useEffect, useContext} from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, List, Avatar, Select, Checkbox, Button, Tooltip } from 'antd'
import { CaretDownOutlined, BellFilled, UserOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from 'next/link'
import './styles.scss'

import moment from 'moment';
import { getNotification } from '../../api/notification'
import { ReactReduxContext } from 'react-redux'


export default function Notification() {
  const [nameUser, setNameUser] = useState([])
  const [type, setType] = useState('')
  const [data_noti, setData] = useState('')
  const [read_at, setReadAt] = useState('')
  const [created_at, setCreatedAt] = useState('')
  const [avatarUser, setAvatarUser] = useState('')

  const [user, setUser] = useState(null)
  const { store } = useContext(ReactReduxContext)

  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      const id = user.get('id')
      getNotification(id).then((response) => {
        const length = response.data.length
        for (let i = 0; i < length; i++) {
          // nameUser.push(response.data[i].user.name);
          setNameUser(nameUser => [...nameUser, response.data[i].user.name]);
          
        }
        // setNameUser(response.data.user.name)
        console.log(nameUser[1])
      })
    }
  }, [user])

  //get noti
  const data = [
    {
      'name' : 'a-san',
      'action': 'add JF',
      'time': '11:12:20',
    },
    {
      'name' : 'a',
      'action': 'add JF',
      'time': '11:12:20',
    },
    {
      'name' : 'a',
      'action': 'add JF',
      'time': '11:12:20',
    },
    {
      'name' : 'a-san',
      'action': 'add JF',
      'time': '11:12:20',
    },
    {
      'name' : 'a-san',
      'action': 'add JF',
      'time': '11:12:20',
    },
  ];

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
            avatar={<Avatar src="/images/logo.png" />}
            title={<div>{item.name} 渡辺さんがマイルストーンの名前を「インタビュー」に変更{item.action}</div>}
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
