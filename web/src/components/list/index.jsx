import React, { useEffect, useState } from 'react'
import { Button, Table, Input, DatePicker } from 'antd'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import QueueAnim from 'rc-queue-anim'
import PropTypes from 'prop-types'
import { taskSearch } from '../../api/top-page'

const { Search } = Input

const List = ({
  searchIcon,
  text,
  showTimeInput,
  showCategoryInput,
  showMilestoneInput,
  showSearchByJFInput,
  dataColumn,
  dataSource,
}) => {
  const [show, setShow] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon)
  const [list, setList] = useState([])

  useEffect(() => {
    setList(dataSource)
  }, [dataSource])

  const onClick = () => {
    setShow(!show)
    setShowSearchIcon(!showSearchIcon)
  }

  const searchByName = (e) => {
    const datas = dataSource.filter((data) => {
      console.log(data.name)
      return (
        data.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      )
    })
    setList(datas)
  }
  const searchByTime = (date, dateString) => {
    if (dataColumn[1].dataIndex === 'type') dateString = dateString.replace('-', '/')
    console.log(dateString)
    const datas = dataSource.filter((data) => data.time.toLowerCase().indexOf(dateString.toLowerCase()) !== -1)
    setList(datas)
  }

  const searchByCategory = (e) => {
    console.log(e.target.value)
    const datas = dataSource.filter(
      (data) => data.category.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1,
    )
    setList(datas)
  }

  const searchByMilestone = (e) => {
    console.log(e.target.value)
    const datas = dataSource.filter(
      (data) => data.milestone.toLowerCase().indexOf(e.target.value.toLowerCase())
        !== -1,
    )
    setList(datas)
  }
  const searchByJobfairName = (e) => {
    const getTask = async () => {
      const response = await taskSearch(e.target.value)
      let tasks = []
      tasks = response.data.map((data) => ({
        name: data.name,
        type: data.status,
        time: data.start_time,
      }))
      setList(tasks)
    }
    getTask()
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '22px', marginBottom: '16px' }}>{text}</p>
        <div className="flex items-center">
          <Button
            style={{ border: 'none', marginBottom: '5px' }}
            shape="circle"
            icon={<PlusCircleOutlined style={{ fontSize: '30px' }} />}
          />

          <span className="queue-demo">
            {showSearchIcon && (
              <Button
                style={{ border: 'none' }}
                shape="circle"
                icon={<SearchOutlined style={{ fontSize: '30px' }} />}
                onClick={onClick}
              />
            )}

            <span>
              <QueueAnim type="right" ease={['easeOutQuart', 'easeInOutQuart']}>
                {show ? (
                  <Search
                    key="demo"
                    placeholder="Enter Name"
                    allowClear
                    enterButton
                    onChange={searchByName}
                  />
                ) : null}
              </QueueAnim>
            </span>
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: '15% 75%',
          height: '480px',
          backgroundColor: 'white',
          border: '1px solid black',
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
                <div className="px-1">Time: </div>
                <div>
                  <DatePicker
                    picker="month"
                    format="YYYY-MM"
                    onChange={searchByTime}
                  />
                </div>
              </div>
            )}

            {showSearchByJFInput && (
              <div className="flex items-center justify-end px-2">
                <div className="px-2">JobFair Name: </div>
                <div>
                  <Input type="text" onChange={searchByJobfairName} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end px-2">
            {showCategoryInput && (
              <div className="flex items-center justify-end px-2">
                <div className="px-2">Categoty: </div>
                <div>
                  <Input type="text" onChange={searchByCategory} />
                </div>
              </div>
            )}

            {showMilestoneInput && (
              <div className="flex items-center justify-end px-2">
                <div className="px-2">Milestone: </div>
                <div>
                  <Input type="text" onChange={searchByMilestone} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table data */}
        <div>
          <Table
            pagination={{
              position: ['bottomCenter'],
              responsive: true,
              defaultPageSize: 5,
              // total: 5,
              // disabled: false,
            }}
            // columns={{ align: 'center' }}
            dataSource={list}
            columns={dataColumn}
          />
        </div>
      </div>
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
}

export default List
