import React, { PureComponent } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import '../style.scss'
import EditCategory from './EditCategory'
import AddCategory from './AddCategory'
import DeleteCategory from './DeleteCategory'

export class List extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      offset: 0,
      tableData: [],
      orgtableData: [],
      perPage: 10,
      currentPage: 0,
      cateEdit: null,
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    // this.onEditSubmit = this.onEditSubmit.bind(this);
  }

   // add
   onSubmit = (data) => {
     const { orgtableData } = this.state
     data.id = orgtableData.length + 1
     orgtableData.push(data)
     this.setState({
       orgtableData,
     })
   }

  // edit
  findIndex = (id) => {
    const { orgtableData } = this.state
    let result = -1
    orgtableData.forEach((data, index) => {
      if (data.id === id) {
        result = index
      }
    })
    return result
  }

  onEdit = (id) => {
    const { orgtableData } = this.state
    const index = this.findIndex(id)
    const cateEdit = orgtableData[index]
    this.setState({
      cateEdit,
    })
  }

  onEditSubmit = (data) => {
    const { orgtableData } = this.state
    const index = this.findIndex(data.id)
    orgtableData[index] = data
  }

  // delete
  onDelete = (id) => {
    const deletedTable = this.state.orgtableData.filter((item) => item.id !== id)
    this.setState({
      orgtableData: deletedTable,
    })
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected
    const offset = selectedPage * this.state.perPage

    this.setState({
      currentPage: selectedPage,
      offset,
    }, () => {
      this.loadMoreData()
    })
  };

  loadMoreData() {
    const data = this.state.orgtableData

    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      tableData: slice,
    })
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    axios
      .get('https://jsonplaceholder.typicode.com/comments')
      .then((res) => {
        const data = res.data

        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          orgtableData: res.data,
          tableData: slice,
        })
      })
  }

  render() {
    const { cateEdit } = this.state

    return (
      <div>
        <div className="flex pt-8 pl-16">
          <label className="text-xl">表示件数: </label>
                  &nbsp;
          <select classNamee="selectBox ">
            <option value="10">10</option>
            <option value="10">25</option>
            <option value="10">50</option>
          </select>
        </div>
        <div>
          <table className="shadow-lg bg-white table">
            <thead>
              <tr>
                <th className="bg-blue-100 border text-left px-8 py-4">No</th>
                <th className="bg-blue-100 border text-left px-8 py-4 t-title">カテゴリー</th>
                <th className="bg-blue-100 border text-left px-8 py-4 w-40">アクション</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.tableData.map((data, index) => (
                  <tr
                    key={data.id}
                    index={index}
                  >
                    <td className="border px-8 py-4">{data.id}</td>
                    <td className="border px-8 py-4 t-title">{data.name}</td>
                    <td className="border px-8 py-4 w-40 flex">
                      <EditCategory
                        data={data}
                        cateEdit={cateEdit}
                        onEdit={this.onEdit}
                        onEditSubmit={this.onEditSubmit}
                      />
                                          &nbsp;
                      <DeleteCategory
                        data={data}
                        onDelete={this.onDelete}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div>
          <AddCategory
            onSubmit={this.onSubmit}
          />
        </div>

        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          breakClassName="break-me"
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />

      </div>
    )
  }
}

export default List
