import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import '../../pages/global.scss'
import {
  HomeOutlined,
  FileProtectOutlined,
  BarChartOutlined,
  TableOutlined,
  FileOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { findSlot } from '../../utils/pages'
import Navbar from '../../components/navbar'
import './style.scss'

const JfLayout = ({ children, bgr }) => {
  const styles = {
    background: 'white',
    borderLeft: '3px solid #ffd803',
    marginBottom: '0px',
  }
  const main = findSlot(JfLayout.Main, children)
  const { Sider, Content } = Layout
  const [collapsed, Setcollapsed] = useState(false)
  const toggleCollapsed = () => {
    Setcollapsed(!collapsed)
  }
  const [id, setIdJf] = useState('')
  useEffect(() => {
    setIdJf(localStorage.getItem('id-jf'))
  }, [children])
  return (
    <div className="menuu">
      <Navbar />
      <Layout className="site-layout" style={{ marginLeft: 0 }}>
        <Sider
          style={{
            left: 0,
            zIndex: 100,
          }}
          className="layout-icon"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
          >
            <div
              className="relative h-20"
              style={{
                marginBottom: '15px',
                cursor: 'pointer',
                transform: collapsed ? 'translate(0)' : 'translate(30%)',
              }}
            >
              <div className="absolute top-0 right-0 ">
                <div className="button" type="primary" onClick={toggleCollapsed}>
                  {collapsed ? (
                    <MenuOutlined className="sidebar-icons" />
                  ) : (
                    <MenuOutlined className="sidebar-icons" />
                  )}
                </div>
              </div>
            </div>
            {bgr === 1 ? (
              <Menu.Item key="1" icon={<HomeOutlined className="sidebar-icons" />} style={styles}>
                <Link href={`/jf-toppage/${id}`}>ホーム</Link>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="1"
                icon={<HomeOutlined className="sidebar-icons" />}
                style={{ background: '#e3f6f5' }}
              >
                <Link href={`/jf-toppage/${id}`}>ホーム</Link>
              </Menu.Item>
            )}

            {bgr === 2 ? (
              <Menu.Item
                key="2"
                icon={<FileProtectOutlined className="sidebar-icons" />}
                style={styles}
              >
                <Link href={`/tasks/${id}`}>タスク</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="2" icon={<FileProtectOutlined className="sidebar-icons" />}>
                <Link href={`/tasks/${id}`}>タスク</Link>
              </Menu.Item>
            )}

            {bgr === 3 ? (
              <Menu.Item
                key="3"
                icon={<BarChartOutlined className="sidebar-icons" />}
                style={styles}
              >
                <Link href={`/grantt-chart/${id}`}>ガントチャート</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="3" icon={<BarChartOutlined className="sidebar-icons" />}>
                <Link href={`/grantt-chart/${id}`}>ガントチャート</Link>
              </Menu.Item>
            )}

            {bgr === 4 ? (
              <Menu.Item key="4" icon={<TableOutlined className="sidebar-icons" />} style={styles}>
                <Link href={`/kanban/${id}`}>カンバン</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="4" icon={<TableOutlined className="sidebar-icons" />}>
                <Link href={`/kanban/${id}`}>カンバン</Link>
              </Menu.Item>
            )}

            {bgr === 5 ? (
              <Menu.Item key="5" icon={<FileOutlined className="sidebar-icons" />} style={styles}>
                <Link href={`/file/${id}`}>ファイル</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="5" icon={<FileOutlined className="sidebar-icons" />}>
                <Link href={`/file/${id}`}>ファイル</Link>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content className="site-layout-background">{_get(main, 'props.children')}</Content>
        </Layout>
      </Layout>
    </div>
  )
}
JfLayout.Main = () => null
JfLayout.propTypes = {
  bgr: PropTypes.number.isRequired,
}
JfLayout.defaultProps = {
  children: [],
}
JfLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
}
export default JfLayout
