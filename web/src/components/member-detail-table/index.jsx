import React from 'react'
import './styles.scss'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
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
            <tr className="assigned-jf border-none block mx-auto">
              <td className="border-none inline-block mr-2">{element.jobfair.name}</td>
              <td className="border-none inline-block">{element.jobfair.start_date}</td>
            </tr>
          )),
        })
        const categorires = res.data.categories
        console.log(res.data)
        this.setState({
          listCate: categorires.map((element) => (
            <tr className="category-name border-none block mx-auto">
              {element.category_name}
            </tr>
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
        <table className="member_table m-5">
          <tr>
            <th>フルネーム：</th>
            <td
              className="min-w-1/2 block  ml-auto mr-auto  py-3 text-left"
              style={{ minHeight: '10px', marginRight: '200px' }}
            >
              {this.state.member.fullName}
            </td>
          </tr>
          <tr>
            <th>メールアドレス：</th>
            <td
              className="min-w-1/2 block  ml-auto mr-auto  py-3 text-left"
              style={{ minHeight: '10px', marginRight: '200px' }}
            >
              {this.state.member.email}
            </td>
          </tr>
          <tr>
            <th>カテゴリー：</th>
            <td
              className="min-w-1/2 block  ml-auto mr-auto  py-3 text-left"
              style={{ minHeight: '10px', marginRight: '200px' }}
            >
              {this.state.listCate}
            </td>
          </tr>
          <tr className="ml-auto mr-auto  py-3  text-left">
            <th>アサインされたJF：</th>
            <td>{this.state.listJF}</td>
          </tr>
        </table>
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
