/* eslint-disable camelcase */
import React from 'react'
// import axios from '../../api/axios'
import { Category } from '../../api/web-init'

class list extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: [],
      loading: true,
    }
  }

  async componentDidMount() {
    const res = await Category()
    if (res.data.status === 200) {
      this.setState({
        categories: res.data.categories,
        loading: false,
      })
    }
  }

  render() {
    let category_HTML = ''
    if (this.state.loading) {
      category_HTML = <tr><td colSpan="2"><h2>Loading...</h2></td></tr>
    } else {
      category_HTML = this.state.categories.map((item) => (
        <tr key={item.id}>
          <td>
            {' '}
            {item.category_name}
          </td>
        </tr>
      ))
    }

    return (
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>category_name</th>
          </tr>
        </thead>
        <tbody>
          {category_HTML}
        </tbody>
      </table>
    )
  }
}

export default list
