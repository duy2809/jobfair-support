import React, {useState} from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, List, Avatar, Input, Checkbox, Button } from 'antd'
import { CaretDownOutlined, BellFilled, UserOutlined, CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'
import './styles.scss'

export default function Navbar() {
  const moreNavbarOptions = (
    <Menu className="border-2 rounded-2xl py-2 top-5 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <Link href="/template-tasks">
          <a>テンプレートタスク</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href="/jf-schedules">
          <a>スケジュール</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href="/milestones">
          <a>マスター設定</a>
        </Link>
      </Menu.Item>
    </Menu>
  )

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
  ];

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

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
            <Input  placeholder="User's name" />
          </div>
          
          <Checkbox className='' onChange={onChange}>Checkbox</Checkbox>
          <Button
          //type="primary"
          icon={<CloseOutlined />}
          onClick={handleVisibleChange}
        />
        </div>
      }
      bordered
      dataSource={data}
      renderItem={item => <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a href="https://ant.design">{item.name} ha ....{item.action}</a>}
        />
        <div>
          {item.time}
        </div>
      </List.Item>}
    />
    </div>
    
  )
  const userInformations = (
    <Menu className="border-2 rounded-2xl py-2 top-3 absolute transform -translate-x-1/2 left-1/2 bg-gray-600">
      <Menu.Item key="0">
        <Link href="/profile">
          <a>プロフィール表示</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href="/logout">
          <a>ログアウト</a>
        </Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="flex justify-between items-center border-2 navbar select-none">
      <div className="flex">
        <div className="w-20 ml-16">
          <Link href="top">
            <a>
              <img src="/images/logo.png" alt="logo" />
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="px-8">
            <Link href="/jobfairs">
              <a>JF</a>
            </Link>
          </div>
          <div className="px-8">
            <Link href="/members">
              <a href="">メンバ</a>
            </Link>
          </div>
          <div className="px-8">
            <Dropdown overlay={moreNavbarOptions} trigger={['click']}>
              <div className="cursor-pointer">
                その他
                <span className="px-1">
                  <CaretDownOutlined className="text-lg" />
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="flex px-16 items-end">
        <div className="px-4 px">
          <Dropdown overlay={notifications} onClick={handleVisibleChange} /* trigger={['hover']} */ visible={visible} placement="bottomCenter">
            <div className="cursor-pointer">
              <BellFilled className="text-3xl bell-icon relative bottom-0.5" />
              <span className="relative text-lg number-notifications -top-2 right-2">
                6
              </span>
            </div>
          </Dropdown>
        </div>
        <div className="px-4">
          <Dropdown overlay={userInformations} trigger={['click']}>
            <div className="px-2 border-4 border-white user-icon-container py-1 cursor-pointer">
              <UserOutlined className="text-xl user-icon" />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
