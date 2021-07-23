import React from 'react'

import 'tailwindcss/tailwind.css'

import { Menu, Dropdown } from 'antd'

import './styles.scss'

import { CaretDownOutlined, BellFilled, UserOutlined } from '@ant-design/icons'

export default function Navbar() {
  const moreNavbarOptions = (
    <Menu className="border-2 rounded-2xl py-2 top-5 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <a href="">テンプレートタスク</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="">スケジュール</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="">マスター設定</a>
      </Menu.Item>
    </Menu>
  )
  const notifications = (
    <Menu className="border-2 rounded-2xl py-2 top-4 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <a href="">通知 1</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="">通知 2</a>
      </Menu.Item>
    </Menu>
  )
  const userInformations = (
    <Menu className="border-2 rounded-2xl py-2 top-3 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <a href="">プロフィール表示</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="">ログアウト</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{ position: 'fixed', zIndex: 1, width: '100%' }} className="flex justify-between items-center border-2 navbar select-none">
      <div className="flex">
        <div className="w-20 ml-16"><a href=""><img src="images/logo.png" alt="logo" /></a></div>
        <div className="flex items-center">
          <div className="px-8"><a href="">JF</a></div>
          <div className="px-8"><a href="">メンバ</a></div>
          <div className="px-8">
            <Dropdown overlay={moreNavbarOptions} trigger={['click']}>
              <div className="cursor-pointer">
                その他
                <span className="px-1"><CaretDownOutlined className="text-lg" /></span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="flex px-16 items-center">
        <div className="px-4">
          <Dropdown overlay={notifications} trigger={['click']}>
            <div className="cursor-pointer">
              <BellFilled className="text-3xl bell-icon relative bottom-0.5" />
              <span className="relative text-lg number-notifications -top-2 right-2">6</span>
            </div>
          </Dropdown>
        </div>
        <div className="px-4">
          <Dropdown overlay={userInformations} trigger={['click']}>
            <div className="px-2 border-4 border-white user-icon-container py-1 cursor-pointer"><UserOutlined className="text-xl user-icon" /></div>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
