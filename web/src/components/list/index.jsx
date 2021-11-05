import React, { useEffect, useState, useRef } from 'react'
import { Table, Input, DatePicker, Tooltip } from 'antd'
import { PlusOutlined, SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { taskSearch } from '../../api/top-page'
import { loadingIcon } from '../loading'
import './style.scss'
// const { Search } = Input;

const List = ({
  searchIcon,
  text,
  showTimeInput,
  showCategoryInput,
  showMilestoneInput,
  showSearchByJFInput,
  dataColumn,
  dataSource,
  route,
  role,
  routeToAdd,
  isLoading,
}) => {
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const ref = useRef()
  const [show, setShow] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon)
  const [newDataColumn, setNewDataColumn] = useState([])
  const [showTable, setShowTable] = useState(true)
  const [list, setList] = useState([])
  const [filter, setFilter] = useState(() => ({
    name: '',
    milestone: '',
    category: '',
    date: '',
  }))
  useEffect(() => {
    setNewDataColumn(
      dataColumn.map((data) => {
        if (data.title === '名前') {
          data.render = (row) => (
            <Tooltip title={row}>
              <a>{truncate(row)}</a>
            </Tooltip>
          )
        }
        return data
      }),
    )
  }, [])
  useEffect(() => {
    setList(dataSource)
  }, [dataSource])

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        return
      }
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
  useEffect(() => {
    let datas = [...list]
    if (filter) {
      if (filter.name) {
        datas = datas.filter(
          (data) => data.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1,
        )
      }
      if (filter.milestone) {
        datas = datas.filter(
          (data) => data.milestone
            .toLowerCase()
            .indexOf(filter.milestone.toLowerCase()) !== -1,
        )
      }
      if (filter.category) {
        datas = datas.filter(
          (data) => data.category
            .toLowerCase()
            .indexOf(filter.category.toLowerCase()) !== -1,
        )
      }
      if (filter.date) {
        if (dataColumn[1].dataIndex === 'type') filter.date = filter.date.replace('-', '/')
        datas = datas.filter(
          (data) => data.time.toLowerCase().indexOf(filter.date.toLowerCase()) !== -1,
        )
      }
      setList(datas)
    }
  }, [filter])
  const onClick = () => {
    setShow(!show)
    setShowSearchIcon(!showSearchIcon)
  }
  const onClickShow = () => {
    setShowTable(!showTable)
  }

  const searchInput = (e, dateString = '') => {
    if (!dateString) {
      if (e.target.name === 'name') {
        setFilter({ ...filter, name: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, name: '' })
          setList(dataSource)
        }
      }
      if (e.target.name === 'milestone') {
        setFilter({ ...filter, milestone: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, milestone: '' })
          setList(dataSource)
        }
      }
      if (e.target.name === 'category') {
        setFilter({ ...filter, category: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, category: '' })
          setList(dataSource)
        }
      }
    } else {
      setFilter({ ...filter, date: dateString })
      if (dateString === '') {
        setFilter({ ...filter, date: '' })
        setList(dataSource)
      }
    }
  }
  const searchByJobfairName = (e) => {
    const getTask = async () => {
      const response = await taskSearch(e.target.value)
      let tasks = []
      tasks = response.data.map((data) => ({
        name: data.name,
        jfName: data.jobfair.name,
        time: data.start_time,
      }))
      setList(tasks)
    }
    getTask()
  }
  return (
    <div className="list-toppage" ref={ref}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <button
          type="button"
          className="flex items-center font-bold"
          style={{
            fontSize: '24px',
            outline: 'none',
          }}
          onClick={onClickShow}
        >
          <span className="">
            {showTable ? (
              <DownOutlined
                style={{ fontSize: '20px', marginRight: '5px' }}
              />
            ) : (
              <UpOutlined style={{ fontSize: '20px', marginRight: '5px' }} />
            )}
          </span>
          {text}
        </button>

        <div className="flex items-center">
          <Link href={route}>

            <img style={{ width: '24px', marginRight: '4px', height: '24px' }} src="https://cdn0.iconfinder.com/data/icons/web-design-and-development-4/512/180-512.png" alt="" />

          </Link>
          {text === 'タスク' || role === 'member' ? null : (
            <Link className="hv-icon" href={routeToAdd}>
              <PlusOutlined style={{ fontSize: '24px', margin: '0 5px' }} />
            </Link>
          )}
          <span className="queue-demo">
            {showSearchIcon && (
              <span className="hv-icon" onClick={onClick}>
                <SearchOutlined
                  style={{ marginLeft: '4px', fontSize: '24px' }}
                />
              </span>
            )}

            <span>
              {show ? (
                <Input
                  // key="demo"
                  name="name"
                  className="no-border"
                  placeholder="名前"
                  onChange={searchInput}
                  bordered
                  prefix={<SearchOutlined />}
                />
              ) : null}
            </span>
          </span>
        </div>
      </div>
      {showTable ? (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
          }}
        >
          <div
            style={{
              display: 'grid',
            }}
          >
            <div className="flex items-center justify-end pl-2">
              {showTimeInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <div>
                    <DatePicker
                      name="date"
                      size="large"
                      placeholder="タイム"
                      format="YYYY/MM/DD"
                      onChange={searchInput}
                    />
                  </div>
                </div>
              )}

              {showSearchByJFInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <div>
                    <Input
                      name="jobfairName"
                      placeholder="就職フェアの名前"
                      type="text"
                      onChange={searchByJobfairName}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pl-2">
              {showCategoryInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <div>
                    <Input
                      name="category"
                      placeholder="カテゴリ"
                      type="text"
                      onChange={searchInput}
                    />
                  </div>
                </div>
              )}

              {showMilestoneInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <div>
                    <Input
                      name="milestone"
                      placeholder="マイルストーン"
                      type="text"
                      onChange={searchInput}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table data */}
          <div>
            <Table
              pagination={false}
              dataSource={list.length >= 5
                ? list.slice(list.length - 5, list.length).reverse()
                : list.reverse()}
              columns={newDataColumn}
              loading={{ spinning: isLoading, indicator: loadingIcon }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

List.propTypes = {
  searchIcon: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  showTimeInput: PropTypes.bool.isRequired,
  showCategoryInput: PropTypes.bool.isRequired,
  showMilestoneInput: PropTypes.bool.isRequired,
  showSearchByJFInput: PropTypes.bool.isRequired,
  dataColumn: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  routeToAdd: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default List
