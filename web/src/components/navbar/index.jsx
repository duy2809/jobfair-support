import React from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown } from 'antd'
import { CaretDownOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import './styles.scss'
import { logout } from '../../api/authenticate'
import Notification from './notification'

export default function Navbar() {
  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.request.status === 200) {
        window.location = '/'
      }
    } catch (error) {
      if (error.request.status === 400) {
        console.log(error)
      }
    }
  }
  const moreNavbarOptions = (
    <Menu className="border-2 rounded-2xl py-2 top-5 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <Link href="/template-tasks">
          <a className="text-base">テンプレートタスク</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href="/schedule">
          <a className="text-base">スケジュール</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href="/milestones">
          <a className="text-base">マスター設定</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link href="/Category">
          <a className="text-base">カテゴリー覧</a>
        </Link>
      </Menu.Item>
    </Menu>
  )
  // const notifications = (
  //   <Menu className="border-2 rounded-2xl py-2 top-4 absolute transform -translate-x-1/2 left-1/2">
  //     <Menu.Item key="0">
  //       <Link href="/">
  //         <a>通知 1</a>
  //       </Link>
  //     </Menu.Item>
  //     <Menu.Item key="1">
  //       <Link href="/">
  //         <a>通知 2</a>
  //       </Link>
  //     </Menu.Item>
  //   </Menu>
  // )
  const userInformations = (
    <Menu className="border-2 rounded-2xl py-2 top-3 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <Link href="/profile">
          <a>プロフィール表示</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href="">
          <a onClick={handleLogout}>ログアウト</a>
        </Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="flex justify-between items-center border-2 navbar select-none shadow-md relative" style={{ zIndex: '1000' }}>
      <div className="flex">
        <div style={{ width: '13.5rem', paddingLeft: '3px' }} sty>
          <Link href="/top-page">
            <a>
              <img src="/images/5.svg" alt="logo" />
            </a>
          </Link>
        </div>
        <div className="flex items-center ml-6">
          <div className="px-8">
            <Link href="/jobfairs">
              <a className="font-bold text-xl rounded-md py-2 px-5">JF</a>
            </Link>
          </div>
          <div className="px-8">
            <Link href="/member">
              <a href="" className="font-bold text-xl">
                メンバ
              </a>
            </Link>
          </div>
          <div className="px-8">
            <Dropdown overlay={moreNavbarOptions} trigger={['click']}>
              <div className="cursor-pointer">
                <span className="font-bold text-xl">その他</span>
                <span className="px-2">
                  <CaretDownOutlined className="text-lg" />
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="flex px-12 items-center">
        <Notification />
        <div className="px-4">
          <Dropdown overlay={userInformations} trigger={['click']}>
            <div className="px-2 border-2 border-black user-icon-container py-1 mb-1 cursor-pointer">
              <UserOutlined className="text-xl user-icon" />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
