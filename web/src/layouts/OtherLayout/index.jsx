import React from 'react'
import { Layout } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { findSlot } from '../../utils/pages'
import Navbar from '../../components/navbar'

const { Header, Content } = Layout
const otherlayout = ({ children }) => {
  const main = findSlot(otherlayout.Main, children)
  return (
    <div className="otherlayout">
      <Layout>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Navbar />
          </Header>
          <Content
            style={{
              margin: '45px 16px',
              padding: 24,
              minHeight: 280,
              backgroud: '#fff',
            }}
          >
            { _get(main, 'props.children') }
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
otherlayout.Main = () => null
otherlayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
otherlayout.defaultProps = {
  children: [],
}
export default otherlayout
