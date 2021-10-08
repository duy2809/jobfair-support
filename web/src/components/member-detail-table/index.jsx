import React from 'react'
import './styles.scss'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { getMember } from '~/api/member-detail'

class MemberDetailTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      member: {
        id: 0,
        avatar: '',
        fullName: '',
        email: '',
        role: 0,
        phoneNumber: '',
        categories: [],
        chatworkID: '',
        assignedJF: [],
      },
      listCate: [],
      listJF: [],
    }
  }

  componentDidMount() {
    // const search = window.location.search
    // const params = new URLSearchParams(search)
    const id = parseInt(this.props.router.query.id, 10)
    getMember(id)
      .then((res) => {
        const member = res.data
        this.setState(
          {
            member: {
              id: member.id,
              email: member.email,
              fullName: member.name,
              avatar: member.avatar,
              role: member.role,
              chatworkID: member.chatwork_id,
              phoneNumber: member.phone_number,
            },
          },
          () => {
            this.setID(id) // set ID and Role after setState
          },
        )

        const listJobfair = res.data.schedules
        this.setState({
          listJF: listJobfair.map((element) => (
            <div className="assigned-jf border-none block mx-auto">
              <div className="border-none inline-block mr-2">{element.jobfair.name}</div>
              <div className="border-none inline-block">{element.jobfair.start_date}</div>
            </div>
          )),
        })
        const categorires = res.data.categories
        console.log(res.data)
        this.setState({
          listCate: categorires.map((element) => (
            <div className="category-name border-none block mx-auto">
              {element.category_name}
            </div>
          )),
        })
      })
      .catch((error) => console.log(error))
  }

  setID(id) {
    this.props.setID(id)
  }

  render() {
    return (
      <div className="flex css_all items-center justify-center">
        <img
          alt="イメージがない"
          src={`/api/avatar/${this.state.member.id}`}
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
          }}
          id="avatar"
          className="mr-10"
        />
        <div className="member_table py-3" style={{ width: '650px' }}>
          <Row>
            <Col span={7} className="text-right align-middle font-bold py-3 pl-5 whitespace-nowrap">
              フルネーム
            </Col>
            <Col
              offset={1}
              className="align-middle py-3 text-left "
            >
              {this.state.member.fullName}
            </Col>
          </Row>
          <Row>
            <Col span={7} className="text-right align-middle font-bold py-3 pl-5 whitespace-nowrap">
              メールアドレス
            </Col>
            <Col
              offset={1}
              className="align-middle py-3 text-left"
            >
              {this.state.member.email}
            </Col>
          </Row>
          <Row>
            <Col span={7} className="text-right align-middle font-bold py-3 pl-5 whitespace-nowrap">
              カテゴリー
            </Col>
            <Col
              offset={1}
              className="align-middle py-3 text-left"
            >
              {this.state.listCate}
            </Col>
          </Row>
          <Row>
            <Col span={7} className="text-right align-middle font-bold py-3 pl-5 whitespace-nowrap">
              アサインされたJF
            </Col>
            <Col
              offset={1}
              className="align-middle py-3 text-left"
            >
              {this.state.listJF}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
export default withRouter(MemberDetailTable)
MemberDetailTable.propTypes = {
  router: PropTypes.any,
  setID: PropTypes.func,
}
MemberDetailTable.defaultProps = {
  router: null,
  setID: null,
}
