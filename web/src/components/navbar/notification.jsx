import React, {useState} from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, List, Avatar, Select, Checkbox, Button, Tooltip } from 'antd'
import { CaretDownOutlined, BellFilled, UserOutlined, CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'
//import './styles.scss'

import moment from 'moment';

export default function Navbar() {
  
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

  
  // get list of user's name
  const { Option } = Select;
  const listUser = [<Option key={0}>All</Option>];
  // const users = [];
  // for (let i = 0; i < users.length; i++) {
  //   listUser.push(<Option key={user[i].id} value={users[i].name}>{users[i].name}</Option>);
  // }
  for (let i = 0; i < data.length; i++) {
    listUser.push(<Option key={i+1} value={data[i].name}>{data[i].name}</Option>);
  }

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
    <div className="noti w-96 border-2 rounded-2xl bg-white">
      <List
      size="small"
      header={
        <div className="noti-header">
          <div>通知</div>
          <div className='noti-input'>
            <Select style={{ width: 200 }} size={100} defaultValue='All' onChange={handleChange} >
              {listUser}
            </Select>
          </div>
          
          <Checkbox className='' onChange={onChange}>未読のみ表示</Checkbox>
          <Button
          type="link"
          icon={<CloseOutlined />}
          onClick={handleVisibleChange}
          />
        </div>
      }
      footer={
        <div className='noti-footer'>
          <Checkbox className='' onChange={onChange}>すべて既読にする</Checkbox>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={item =>  <List.Item>
          <div className="noti-list-item">
            <List.Item.Meta
            avatar={<Avatar src="/images/logo.png" />}
            title={<div>{item.name} ha ....{item.action}</div>}
            /> 
            <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
              <span>{moment().subtract(2, 'days').fromNow(true)}</span>
            </Tooltip>
          </div>    
      </List.Item>}
      />
    </div>
  )

  return (
    <div className="px-4 px">
        <Dropdown overlay={notifications} onClick={handleVisibleChange} /* trigger={['hover']} */ visible={visible} placement="bottomCenter">
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
