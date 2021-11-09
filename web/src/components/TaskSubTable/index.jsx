import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Input, DatePicker, Tooltip, Tag } from 'antd'
import {
  SearchOutlined,
  DownOutlined,
  UpOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { loadingIcon } from '../loading'
import './style.scss'

// const { Search } = Input;

const TaskSubTable = ({
  searchIcon,
  text,
  showTimeInput,
  taskReviewerList,
  dataColumn,
  dataSource,
  route,
  isLoading,
}) => {
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const ref = useRef()
  const [newDataColumn, setNewDataColumn] = useState([])
  const [show, setShow] = useState(false)
  const [showTable, setShowTable] = useState(true)
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon)
  const [list, setList] = useState([])
  const [optionStatus, setOptionStatus] = useState('すべて')
  const [optionReviewer, setOptionReviewer] = useState('すべて')

  // const [searchNameValue, setSearchNameValue] = useState('')
  // const [searchDateValue, setSearchDateValue] = useState('')
  // const [tasks, setTasks] = useState([])

  const [filter, setFilter] = useState(() => ({
    name: '',
    date: '',
    status: '',
    reviewer_task: [],
  }))

  function parseDate(str) {
    const mdy = str.split('/')
    return new Date(mdy[0], mdy[1] - 1, mdy[2])
  }
  function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24))
  }
  function taskNameToLink(name) {
    let id = 0
    dataSource.forEach((item) => {
      if (item.name.indexOf(name.row) > -1) {
        id = item.key
      }
    })
    return '/task-detail/' + id
  }
  useEffect(() => {
    // console.log(filter)
    setList(dataSource)
    const today = new Date()
    // const currentDate = `${today.getFullYear()}-${
    //   today.getMonth() + 1
    // }-${today.getDate()}`
    dataSource.map((data) => {
      if (data.status === '中 断') {
        data.time = '中断'
      } else if (datediff(parseDate(data.time), today) > 0) {
        data.time = `後${datediff(parseDate(data.time), today)}日`
      } else if (datediff(parseDate(data.time), today) < 0) {
        data.time = `${-datediff(parseDate(data.time), today)}日遅くれ`
      } else {
        data.time = '今日'
      }
      setNewDataColumn(
        dataColumn.map((dataItem) => {
          // console.log(taskReviewerList)
          if (dataItem.title === 'タスク名前') {
            dataItem.render = (row) => (
	            <>
                <Link href= { taskNameToLink({row}) }>{row}</Link>
	          </>
            )
          }
          if (dataItem.title === 'JF名前'){
          data.render = (row) => (
            <Tooltip title={row}>
              <a>{truncate(row)}</a>
            </Tooltip>
            )
          }
          if (dataItem.title === 'タイム') {
            dataItem.render = (row) => dataSource.map((dataLine) => {
              let color = ''
              if (dataLine.time.indexOf('中断') > -1) {
                color = 'geekblue'
              } else if (dataLine.time.indexOf('日遅くれ') > -1) {
                color = 'volcano'
              } else if (dataLine.time.indexOf('後') > -1) {
                color = 'green'
              }
              if (dataLine.time === row) {
                return (
                  <Tag color={color} key={dataLine.time}>
                    {dataLine.time}
                  </Tag>
                )
              }
              return null
            })
          }
          return dataItem
        }),
      )
      return null
    })
    // console.log(dataSource)
  }, [dataSource])
  useEffect(() => {
    let datas = [...list]
    if (filter) {
      if (filter.name) {
        datas = datas.filter(
          (data) => data.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1,
        )
      }
      if (filter.status) {
        datas = datas.filter(
          (data) => data.status.toLowerCase().indexOf(filter.status.toLowerCase())
            !== -1,
        )
      }
      if (filter.reviewer_task) {
        datas = datas.filter(
          (data) => filter.reviewer_task.includes(data.key) === true,
        )
        // console.log(datas)
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

  const onClick = () => {
    setShow(!show)
    setShowSearchIcon(!showSearchIcon)
  }

  const onClickShow = () => {
    setShowTable(!showTable)
  }
  const handleSelectStatus = (value) => {
    setOptionStatus(value.target.innerText)
    if (value.target.innerText === 'すべて') setFilter({ ...filter, status: '' })
    else setFilter({ ...filter, status: value.target.innerText })
    // console.log(filter)
    setList(dataSource)
  }
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  const handleSelectReviewer = (value) => {
    filter.reviewer_task = []
    const tempTask = []
    // console.log(dataSource)
    setOptionReviewer(value.target.innerText)
    if (value.target.innerText === 'すべて') {
      dataSource.forEach((item) => {
        tempTask.push(item.key)
      })
      taskReviewerList.forEach((item) => {
        tempTask.push(item.id)
      })
      var unique =tempTask.filter(onlyUnique);
      setFilter({ ...filter, reviewer_task: unique })
    }
    else if (value.target.innerText === '担当者') {
      dataSource.forEach((item) => {
        tempTask.push(item.key)
      })
      setFilter({ ...filter, reviewer_task: tempTask })
    } else {
      taskReviewerList.forEach((item) => {
        tempTask.push(item.id)
      })
      setFilter({ ...filter, reviewer_task: tempTask })
    }

    // console.log(filter)
    setList(dataSource)
  }
  const searchInput = (e, dateString = '') => {
    // console.log(e)
    if (!dateString) {
      if (e.target.name === 'name') {
        setFilter({ ...filter, name: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, name: '' })
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
  return (
    <div ref={ref}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div>
          <button
            type="button"
            className="flex items-center"
            style={{
              fontSize: '30px',
              outline: 'none',
            }}
            onClick={onClickShow}
          >
            <span>
              {showTable ? (
                <DownOutlined
                  style={{ fontSize: '25px', marginRight: '5px' }}
                />
              ) : (
                <UpOutlined style={{ fontSize: '25px', marginRight: '5px' }} />
              )}
            </span>
            {text}
          </button>
        </div>

        <div className="flex items-center">
          <Link href={route}>
            <Button
              style={{ border: 'none', marginBottom: '5px' }}
              shape="circle"
              icon={<ExportOutlined style={{ fontSize: '30px' }} />}
            />
          </Link>
          <span className="queue-demo">
            {showSearchIcon && (
              <Button
                style={{ border: 'none' }}
                shape="circle"
                icon={(
                  <SearchOutlined
                    style={{ marginLeft: '4px', fontSize: '30px' }}
                  />
                )}
                onClick={onClick}
              />
            )}

            <span>
              {show ? (
                <Input
                  // key="demo"
                  name="name"
                  className="no-border"
                  placeholder="タスク名前"
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
            display: 'grid',
            gridTemplateRows: '30% 75%',
            height: '480px',
            backgroundColor: 'white',
            border: '1px solid white',
            borderRadius: '10px',
          }}
        >
          <div
            style={{
              display: 'grid',
            }}
          >
            <div className="flex items-center justify-end px-2">
              {showTimeInput && (
                <div className="flex items-center justify-end px-2">
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
            </div>

            <div className="flex items-center justify-end px-5">
              <div className="text-xl w-full items-center">
                <div className="flex items-center">
                  <div className="my-2 mr-2 ml-5">
                    <b>役割</b>
                  </div>
                  <Button
                    name="reviewer"
                    onClick={handleSelectReviewer}
                    className={`border-0 mx-4 ${
                      optionReviewer === 'すべて' ? 'option-active' : ''
                    }`}
                  >
                    すべて
                  </Button>
                  <Button
                    name="reviewer"
                    onClick={handleSelectReviewer}
                    className={`border-0 mx-4 ${
                      optionReviewer === '担当者' ? 'option-active' : ''
                    }`}
                  >
                    担当者
                  </Button>
                  <Button
                    name="reviewer"
                    onClick={handleSelectReviewer}
                    className={`border-0 mx-4 ${
                      optionReviewer === 'レビュアー' ? 'option-active' : ''
                    }`}
                  >
                    レビュアー
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="my-5 mr-2">
                    <b>期限日</b>
                  </div>
                  <Button
                    name="status"
                    onClick={handleSelectStatus}
                    className={`border-0 mx-4 ${
                      optionStatus === 'すべて' ? 'option-active' : ''
                    }`}
                  >
                    すべて
                  </Button>
                  <Button
                    name="status"
                    onClick={handleSelectStatus}
                    className={`border-0 mx-4 ${
                      optionStatus === '進行中' ? 'option-active' : ''
                    }`}
                  >
                    進行中
                  </Button>
                  <Button
                    name="status"
                    onClick={handleSelectStatus}
                    className={`border-0 mx-4 ${
                      optionStatus === '今まで' ? 'option-active' : ''
                    }`}
                  >
                    今まで
                  </Button>
                  <Button
                    name="status"
                    onClick={handleSelectStatus}
                    className={`border-0 mx-4 ${
                      optionStatus === '期限きれ' ? 'option-active' : ''
                    }`}
                  >
                    期限きれ
                  </Button>
                  <Button
                    name="status"
                    onClick={handleSelectStatus}
                    className={`border-0 mx-4 ${
                      optionStatus === '中 断' ? 'option-active' : ''
                    }`}
                  >
                    中断
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Table data */}
          <div>
            <Table
              scroll={{ y: 280, x: 240 }}
              pagination={false}
              dataSource={list.reverse()}
              columns={newDataColumn}
              loading={{ spinning: isLoading, indicator: loadingIcon }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

TaskSubTable.propTypes = {
  searchIcon: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  taskReviewerList: PropTypes.array.isRequired,
  showTimeInput: PropTypes.bool.isRequired,
  dataColumn: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default TaskSubTable
