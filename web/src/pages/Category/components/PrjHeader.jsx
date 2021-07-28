/* eslint-disable react/button-has-type */
import React from 'react'
import '../assets/style/PrjHeader.css'
import { Layout, Menu } from 'antd'

const { SubMenu } = Menu
const { Header } = Layout

const PrjHeader = () => (
  <div className="container-fluid">
    <Layout>
      <Header className="header">
        <button className="logo">
          <img src="./logo.png" alt="logo" />
        </button>
        <Menu mode="horizontal" className="menu">
          <Menu.Item key={1}>
            <a href="/">ダッシュボード</a>
          </Menu.Item>
          <Menu.Item key={2}>
            <a href="/">JF</a>
          </Menu.Item>
          <Menu.Item key={3}>
            <a href="/">メンバー</a>
          </Menu.Item>
          <SubMenu title={(
            <span className="sub-menu">
              その他
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          >

            <Menu.Item>テンプレートタスク</Menu.Item>
            <Menu.Item>スケジュール</Menu.Item>
            <Menu.Item>マスター</Menu.Item>
          </SubMenu>

          <Menu.Item className="right-menu">
            <a href="/">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </a>
          </Menu.Item>
          <Menu.Item className="right-menu">
            <a href="/">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
          </Menu.Item>
        </Menu>
      </Header>
    </Layout>
  </div>
)

export default PrjHeader
