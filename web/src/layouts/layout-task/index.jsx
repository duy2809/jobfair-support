import {
  BarChartOutlined,
  FileOutlined,
  FileProtectOutlined,
  HomeOutlined,
  MenuOutlined,
  TableOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Avatar, Input } from 'antd'
import _get from 'lodash/get'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { jfdata } from '../../api/jf-toppage'
import Navbar from '../../components/navbar'
import '../../pages/global.scss'
import { findSlot } from '../../utils/pages'
import './style.scss'
import { getAvatar } from '../../api/profile'

const JfLayout = ({ children, id, bgr }) => {
  const router = useRouter()
  const styles = {
    background: 'white',
    borderLeft: '3px solid #ffd803',
    marginBottom: '0px',
  }
  const main = findSlot(JfLayout.Main, children)
  const ref = useRef()
  const [startDate, setStartDate] = useState()
  const [numberOfStudents, setNumberOfStudents] = useState()
  const [numberOfCompanies, setNumberOfCompanies] = useState()
  const [AdminId, setAdminId] = useState()
  const [name, setName] = useState('')
  const { Sider, Content } = Layout
  const [collapsed, Setcollapsed] = useState(true)
  const [avatarAdmin, setAvatarAdmin] = useState(null)
  const [show, setShow] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(true)
  const onClick = () => {
    setShow(!show)
    setShowSearchIcon(!showSearchIcon)
  }
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      router.push({ pathname: `/tasks/${id}`, query: { name: e.target.value } })
    }
  }
  const toggleCollapsed = () => {
    Setcollapsed(!collapsed)
  }
  const fetchJF = async () => {
    if (id) {
      await jfdata(id).then((response) => {
        setName(response.data.name)
        setStartDate(response.data.start_date.split('-').join('/'))
        setNumberOfStudents(response.data.number_of_students)
        setNumberOfCompanies(response.data.number_of_companies)
        setAdminId(response.data.jobfair_admin_id)
      })
      if (AdminId) {
        await getAvatar(AdminId)
          .then((res) => {
            if (!res.data) {
              setAvatarAdmin(null)
            } else {
              const link = `../../api/avatar/${AdminId}`
              setAvatarAdmin(link)
            }
          })
          .catch(() => setAvatarAdmin(null))
      }
    }
  }
  useEffect(() => {
    fetchJF()
  }, [children])
  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        // console.log(ref.current, event.target)
        return
      }
      // console.log(ref)

      setShow(false)
      setShowSearchIcon(true)
    }

    document.body.addEventListener('click', onBodyClick, { capture: true })

    return () => {
      document.body.removeEventListener('click', onBodyClick, {
        capture: true,
      })
    }
  }, [])
  return (
    <div className="layout-task">
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
              className="relative h-20 cursor-pointer"
              style={{
                transform: collapsed ? 'translate(-20.5%)' : 'translate(0%)',
              }}
            >
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
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
                <Link href={`/gantt-chart/${id}`}>ガントチャート</Link>
              </Menu.Item>
            ) : (
              <Menu.Item key="3" icon={<BarChartOutlined className="sidebar-icons" />}>
                <Link href={`/gantt-chart/${id}`}>ガントチャート</Link>
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
          <div className="Jf__header px-10">
            <h1>{name}</h1>
            <div className="admin__jf">
              <span className="text-lg">{startDate ?? 'N/A'}</span>
              <span className="text-lg px-2 ">{`企業: ${numberOfCompanies ?? 'N/A'}`}</span>
              <span className="text-lg px-2 ">{`学生: ${numberOfStudents ?? 'N/A'}`}</span>
              <div className="avatar pl-3 pr-2">
                {avatarAdmin ? (
                  <Avatar size={45} src={avatarAdmin} />
                ) : (
                  <Avatar
                    size={45}
                    style={{
                      backgroundColor: '#FFD802',
                    }}
                    src="../images/avatars/default.jpg"
                  />
                )}
              </div>
              <span className="queue-demo">
                {showSearchIcon && (
                  <a className="hv-icon" onClick={onClick}>
                    <SearchOutlined style={{ marginLeft: '4px', fontSize: '30px' }} />
                  </a>
                )}

                <span ref={ref}>
                  {show ? (
                    <Input
                      // key="demo"
                      style={{
                        width: '200px',
                        height: '40px',
                      }}
                      name="name"
                      className="no-border"
                      placeholder="タスク"
                      // onChange={searchInput}
                      bordered
                      prefix={<SearchOutlined />}
                      autoComplete="off"
                      onKeyPress={onEnter}
                    />
                  ) : null}
                </span>
              </span>
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
