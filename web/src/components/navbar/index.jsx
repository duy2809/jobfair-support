import React, { useState, useEffect, useContext } from 'react'
import 'tailwindcss/tailwind.css'
import { Menu, Dropdown, Avatar } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import './styles.scss'
import { logout } from '../../api/authenticate'
import Notification from './notification'
import { getAvatar } from '../../api/profile'

export default function Navbar() {
  const { store } = useContext(ReactReduxContext)

  const [user, setUser] = useState(null)
  const [avatarUser, setAvatarUser] = useState('')
  useEffect(async () => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      const id = user.get('id')
      await getAvatar(id)
        .then((res) => {
          if (!res.data) {
            setAvatarUser(null)
          } else {
            const link = `../../api/avatar/${id}`
            setAvatarUser(link)
          }
        })
        .catch(() => setAvatarUser(null))
    }
  }, [user])
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
        <a href="/template-tasks" className="text-base">
          テンプレートタスク
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/schedule" className="text-base">
          スケジュール
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="/master-setting" className="text-base">
          マスター設定
        </a>
      </Menu.Item>
    </Menu>
  )

  const userInformations = (
    <Menu className="border-2 rounded-2xl py-2 top-3 absolute transform -translate-x-1/2 left-1/2">
      <Menu.Item key="0">
        <a href="/profile">プロフィール表示</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a onClick={handleLogout}>ログアウト</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <div
      className="flex items-center justify-between border-2 navbar select-none shadow-md relative"
      style={{ padding: '0 2.75rem 0px 0', zIndex: '1000', height: '80px' }}
    >
      <div className="flex">
        <div style={{ width: '13.5rem', paddingLeft: '3px' }}>
          <a href="/top-page">
            <img src="/images/5.svg" alt="logo" />
          </a>
        </div>
        <div className="flex items-center" style={{ marginLeft: '51px' }}>
          <div className="px-8" style={{ minWidth: '140px' }}>
            <a
              href="/jobfairs"
              className="font-bold text-xl rounded-md py-2 px-5"
            >
              JF
            </a>
          </div>
          <div className="px-8" style={{ minWidth: '140px' }}>
            <a href="/member" className="font-bold text-xl">
              メンバ
            </a>
          </div>
          <div className="px-8 ml-2" style={{ minWidth: '140px' }}>
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
      <div className="flex items-center ">
        <Notification />
        <div className="pl-4">
          <Dropdown overlay={userInformations} trigger={['click']}>
            {avatarUser ? (
              <Avatar
                size={45}
                style={{
                  cursor: 'pointer',
                }}
                src={avatarUser}
              />
            ) : (
              <Avatar
                size={45}
                style={{
                  backgroundColor: '#FFD802',
                  cursor: 'pointer',
                }}
                src="../images/avatars/default.jpg"
              />
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
