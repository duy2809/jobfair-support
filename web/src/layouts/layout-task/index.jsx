import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import './style.scss'
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
import { jfdata } from '../../api/jf-toppage'
import { findSlot } from '../../utils/pages'
import Navbar from '../../components/navbar'

const JfLayout = ({ children, id, bgr }) => {
  const styles = {
    background: 'white',
    borderLeft: '8px solid #ffd803',
    marginBottom: '0px',
<<<<<<< HEAD
=======

>>>>>>> fix UI submenu
  }
  const main = findSlot(JfLayout.Main, children)
  const [startDate, setStartDate] = useState()
  const [avt, setAvt] = useState('')
  const [numberOfStudents, setNumberOfStudents] = useState()
  const [numberOfCompanies, setNumberOfCompanies] = useState()
  const [name, setName] = useState('')
  const { Sider, Content } = Layout

  const [collapsed, Setcollapsed] = useState(false)
  const toggleCollapsed = () => {
    Setcollapsed(!collapsed)
  }
  const fetchJF = async () => {
    if (id) {
      await jfdata(id)
        .then((response) => {
          setName(response.data.name)
          setStartDate(response.data.start_date.split('-').join('/'))
          setAvt(response.data.user.avatar)
          setNumberOfStudents(response.data.number_of_students)
          setNumberOfCompanies(response.data.number_of_companies)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  useEffect(() => {
    fetchJF()
  }, [children])
  return (
    <div className="layout-task">
      <Navbar />
      <Layout className="site-layout" style={{ marginLeft: 0 }}>
        <Sider
          style={{
            left: 0,
            zIndex: 100,
          }}
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
            <div className="relative h-10 " style={{ marginBottom: '32px' }}>
              <div className="absolute top-0 right-0 ">
<<<<<<< HEAD
                <div className="button" type="primary" onClick={toggleCollapsed}>
                  {collapsed ? (
                    <MenuOutlined className="sidebar-icons" />
                  ) : (
                    <MenuOutlined className="sidebar-icons" />
                  )}
=======
                <div
                  className="button"
                  type="primary"
                  onClick={toggleCollapsed}
                >
                  {collapsed ? <MenuOutlined /> : <MenuOutlined />}
>>>>>>> fix UI submenu
                </div>
              </div>
            </div>
            {bgr === 1 ? (
<<<<<<< HEAD
              <Menu.Item key="1" icon={<HomeOutlined className="sidebar-icons" />} style={styles}>
                <Link href={`/jf-toppage/${id}`}>ホーム</Link>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="1"
                icon={<HomeOutlined className="sidebar-icons" />}
                style={{ background: '#e3f6f5' }}
              >
=======
              <Menu.Item key="1" icon={<HomeOutlined />} style={styles}>
                <Link href={`/jf-toppage/${id}`}>ホーム</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="1" icon={<HomeOutlined />} style={{ background: '#e3f6f5' }}>
>>>>>>> fix UI submenu
                <Link href={`/jf-toppage/${id}`}>ホーム</Link>
              </Menu.Item>
            )}

            {bgr === 2 ? (
<<<<<<< HEAD
              <Menu.Item
                key="2"
                icon={<FileProtectOutlined className="sidebar-icons" />}
                style={styles}
              >
                <Link href={`/tasks/${id}`}>タスク</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="2" icon={<FileProtectOutlined className="sidebar-icons" />}>
=======
              <Menu.Item key="2" icon={<FileProtectOutlined />} style={styles}>
                <Link href={`/tasks/${id}`}>タスク</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="2" icon={<FileProtectOutlined />}>
>>>>>>> fix UI submenu
                <Link href={`/tasks/${id}`}>タスク</Link>
              </Menu.Item>
            )}

            {bgr === 3 ? (
<<<<<<< HEAD
              <Menu.Item
                key="3"
                icon={<BarChartOutlined className="sidebar-icons" />}
                style={styles}
              >
                <Link href={`/grantt-chart/${id}`}>ガントチャート</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="3" icon={<BarChartOutlined className="sidebar-icons" />}>
=======
              <Menu.Item key="3" icon={<BarChartOutlined />} style={styles}>
                <Link href={`/grantt-chart/${id}`}>ガントチャート</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="3" icon={<BarChartOutlined />}>
>>>>>>> fix UI submenu
                <Link href={`/grantt-chart/${id}`}>ガントチャート</Link>
              </Menu.Item>
            )}

            {bgr === 4 ? (
<<<<<<< HEAD
              <Menu.Item key="4" icon={<TableOutlined className="sidebar-icons" />} style={styles}>
                <Link href={`/kanban/${id}`}>カンバン</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="4" icon={<TableOutlined className="sidebar-icons" />}>
=======
              <Menu.Item key="4" icon={<TableOutlined />} style={styles}>
                <Link href={`/kanban/${id}`}>カンバン</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="4" icon={<TableOutlined />}>
>>>>>>> fix UI submenu
                <Link href={`/kanban/${id}`}>カンバン</Link>
              </Menu.Item>
            )}

            {bgr === 5 ? (
<<<<<<< HEAD
              <Menu.Item key="5" icon={<FileOutlined className="sidebar-icons" />} style={styles}>
                <Link href={`/file/${id}`}>ファイル</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="5" icon={<FileOutlined className="sidebar-icons" />}>
                <Link href={`/file/${id}`}>ファイル</Link>
              </Menu.Item>
            )}
=======
              <Menu.Item key="5" icon={<FileOutlined />} style={styles}>
                <Link href={`/file/${id}`}>ファイル</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="5" icon={<FileOutlined />}>
                <Link href={`/file/${id}`}>ファイル</Link>
              </Menu.Item>
            )}

>>>>>>> fix UI submenu
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <div className="Jf__header">
            <h1>{name}</h1>
            <div className="admin__jf">
              <h3>{startDate}</h3>
              <h3>{`企業:${numberOfStudents}`}</h3>
              <h3>{`学生:${numberOfCompanies}`}</h3>
              <img className="avt" src={avt} alt="avatar" />
            </div>
          </div>
          <Content className="site-layout-background">{_get(main, 'props.children')}</Content>
        </Layout>
      </Layout>
    </div>
  )
}
JfLayout.Main = () => null
JfLayout.propTypes = {
  id: PropTypes.number.isRequired,
  bgr: PropTypes.number.isRequired,
}
JfLayout.defaultProps = {
  children: [],
}
JfLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
}
export default JfLayout
