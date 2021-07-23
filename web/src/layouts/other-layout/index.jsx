import React from 'react'
import { Layout } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { findSlot } from '../../utils/pages'
import Navbar from '../../components/navbar'

const { Content } = Layout
const Otherlayout = ({ children }) => {
  const main = findSlot(Otherlayout.Main, children)
  return (
    <div className="otherlayout">
      <Layout>
        <Layout className="site-layout">

          <Navbar style={{ position: 'fixed', zIndex: 1, width: '100%' }} />

          <Content
            style={{ padding: '50px 41px', marginTop: 64 }}

          >
            { _get(main, 'props.children') }
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
Otherlayout.Main = () => null
Otherlayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
Otherlayout.defaultProps = {
  children: [],
}
export default Otherlayout
