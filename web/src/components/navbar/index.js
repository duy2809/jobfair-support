import React from 'react'

import 'tailwindcss/tailwind.css'

import { Menu, Dropdown } from 'antd'

import './styles.scss'

import { CaretDownOutlined, BellFilled, UserOutlined } from '@ant-design/icons'

export default function Navbar() {
  const moreNavbarOptions = (
    <Menu className="border-2 rounded-2xl py-2 top-7">
      <Menu.Item key="0">
        <a href="">テンプレートタスク</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="">JF スケジュール</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="">マスター セッティング</a>
      </Menu.Item>
    </Menu>
  )
  const notifications = (
    <Menu className="border-2 rounded-2xl py-2 top-7">
      <Menu.Item key="0">
        <a href="">通知 1</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="">通知 2</a>
      </Menu.Item>
    </Menu>
  )
  const userInformations = (
    <Menu className="border-2 rounded-2xl py-2 top-7">
      <Menu.Item key="0">
        <a href="">プロフィール</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="">ログアウト</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="flex justify-between items-center border-2 navbar select-none">
      <div className="flex">
        <div className="w-20"><a><img src="images/logo.png" alt="logo" /></a></div>
        <div className="flex items-center">
          <div className="px-4"><a>ダッシュボード</a></div>
          <div className="px-4"><a>JF</a></div>
          <div className="px-4"><a>メンバー</a></div>
          <div className="px-4">
            <Dropdown overlay={moreNavbarOptions} trigger={['click']}>
              <div className="cursor-pointer">
                その他
                <span className="px-1"><CaretDownOutlined className="text-lg" /></span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="flex px-10 items-center">
        <div className="px-3">
          <Dropdown overlay={notifications} trigger={['click']}>
            <div className="cursor-pointer">
              <BellFilled className="text-2xl bell-icon" />
              <span className="relative bottom-2 text-lg number-notifications">6</span>
            </div>
          </Dropdown>
        </div>
        <div className="flex px-3 items-center">
          <div className="px-2 border-4 border-white user-icon-container py-1"><UserOutlined className="text-xl user-icon" /></div>
          <div className="px-5">
            <Dropdown overlay={userInformations} trigger={['click']}>
              <div className="cursor-pointer">名前を使用</div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}
