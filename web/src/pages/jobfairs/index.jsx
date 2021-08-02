import React, { useEffect, useState } from 'react'
import { Table, Button, Slider, DatePicker, Input, Empty, Space, Modal, Select, notification } from 'antd'
import './style.scss'
import { SearchOutlined, EditTwoTone, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import OtherLayout from '../../layouts/OtherLayout'
import { getJFList, deleteJFList } from '../../api/jf-list'

export default function JFList() {
  const openNotificationSuccess = () => {
    notification.success({
      message: '正常に削除されました',
    })
  }

  // state of table
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], showSizeChanger: false, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [dataFilter, setDataFilter] = useState()
  const { Option } = Select

  // select number to display
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem('pagination', JSON.stringify({ ...pagination, pageSize: value }))
  }

  const initPagination = () => {
    const paginationData = JSON.parse(localStorage.getItem('pagination'))
    if (paginationData === null) {
      localStorage.setItem('pagination', JSON.stringify(pagination))
    } else {
      setPagination((preState) => ({
        ...preState,
        pageSize: paginationData.pageSize,
      }))
      setItemCount(paginationData.pageSize)
    }
  }

  // add data of table
  const addDataOfTable = (response) => {
    const data = []
    for (let i = 0; i < response.data.length; i += 1) {
      data.push({
        id: i + 1,
        idJF: response.data[i].id,
        JF名: response.data[i].name,
        開始日: response.data[i].start_date.replaceAll('-', '/'),
        推定参加学生数: response.data[i].number_of_students,
        参加企業社数: response.data[i].number_of_companies,
        管理者: response.data[i].admin,
      })
    }
    setTemperaryData(data)
    setOriginalData(data)
    setDataFilter(data)
  }

  // Modal of delete record

  const confirmModle = (key) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      centered: true,
      onOk: async () => {
        setLoading(true)
        try {
          await deleteJFList(key).then((response) => {
            addDataOfTable(response)
            openNotificationSuccess()
          })
        } catch (error) {
          console.log(error)
        }
        setLoading(false)
      },
      onCancel: () => { },
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }

  // columns of tables

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'No.',
      width: '5%',
      render: (id) => id,
    },
    {
      title: 'JF名',
      width: 80,
      dataIndex: 'JF名',
      key: '0',
      fixed: 'left',
      render: (name, record) => <a href={`/jf-toppage/${record.id}`}>{name}</a>,
      ellipsis: true,
    },

    {
      title: '開始日',
      width: 100,
      dataIndex: '開始日',
      fixed: 'left',
    },
    {
      title: '推定参加学生数',
      dataIndex: '推定参加学生数',
      width: 100,
    },
    {
      title: '参加企業社数',
      dataIndex: '参加企業社数',
      width: 100,
    },
    {
      title: '管理者',
      dataIndex: '管理者',
      width: 100,
    },
    {
      title: '',
      dataIndex: 'action',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <Space size="middle">
          <a href={`/edit-jf/${record.idJF}`}>
            <abbr title="編集" style={{ cursor: 'pointer' }}>
              <EditTwoTone />
            </abbr>
          </a>
          <abbr title="消去" style={{ cursor: 'pointer' }}>
            <DeleteTwoTone onClick={() => {
              confirmModle(record.idJF)
            }}
            />
          </abbr>
        </Space>
      ),
    },

  ]

  // data of table get from database

  useEffect(async () => {
    setLoading(true)
    initPagination()
    await getJFList().then((response) => {
      addDataOfTable(response)
    })
      .catch((error) => {
        console.log(error)
      })
    setLoading(false)
  }, [itemCount])

  // State of filter'
  const [valueSearch, setValueSearch] = useState('')
  const [rangeStudentsNumber, setRangeStudentsNumber] = useState([0, 100])
  const [rangeBussinessesNumber, setRangeBussinessesNumber] = useState([0, 100])
  const [startDate, setStartDate] = useState('')

  // Search data on Table

  const searchDataOnTable = (value) => {
    value = value.toLowerCase()
    const filteredData = originalData.filter((JF) => (JF.JF名.toLowerCase().includes(value) || JF.管理者.toLowerCase().includes(value))
      && (JF.推定参加学生数 <= rangeStudentsNumber[1] && JF.推定参加学生数 >= rangeStudentsNumber[0])
      && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0])
      && (JF.開始日.includes(startDate)))
    return filteredData
  }
  const onSearch = (e) => {
    setLoading(true)
    const currValue = e.target.value
    if (!currValue) {
      setValueSearch('')
      setTemperaryData(dataFilter)
      setLoading(false)
      return
    }
    setValueSearch(currValue)
    setTemperaryData(searchDataOnTable(currValue))
    setLoading(false)
  }

  // filter by number of students

  const FilterStudentsNumber = (value) => {
    setRangeStudentsNumber(value)
    const filteredData = originalData.filter((JF) => (JF.推定参加学生数 <= value[1] && JF.推定参加学生数 >= value[0])
      && (JF.JF名.includes(valueSearch) || JF.管理者.includes(valueSearch))
      && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0])
      && (JF.開始日.includes(startDate)))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
  }
  // filter by number of businesses

  const FilterBussinessesNumber = (value) => {
    setRangeBussinessesNumber(value)
    const filteredData = originalData.filter((JF) => (JF.参加企業社数 <= value[1] && JF.参加企業社数 >= value[0])
      && (JF.JF名.includes(valueSearch) || JF.管理者.includes(valueSearch))
      && (JF.推定参加学生数 <= rangeStudentsNumber[1] && JF.推定参加学生数 >= rangeStudentsNumber[0])
      && (JF.開始日.includes(startDate)))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
  }

  // filter by start date

  const FilterStartDate = (date, dateString) => {
    if (dateString === '') {
      setStartDate('')
      const filteredData = originalData.filter((JF) => (JF.JF名.includes(valueSearch) || JF.管理者.includes(valueSearch))
        && (JF.推定参加学生数 <= rangeStudentsNumber[1] && JF.推定参加学生数 >= rangeStudentsNumber[0])
        && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0]))
      setTemperaryData(filteredData)
      setDataFilter(filteredData)
      return
    }
    setStartDate(dateString)
    const filteredData = originalData.filter((JF) => (JF.開始日 === dateString)
      && (JF.JF名.includes(valueSearch) || JF.管理者.includes(valueSearch))
      && (JF.推定参加学生数 <= rangeStudentsNumber[1] && JF.推定参加学生数 >= rangeStudentsNumber[0])
      && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0]))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
  }

  const [showFilter, setShowFilter] = useState(true)

  // hide filter

  const hideFilter = () => {
    setShowFilter(false)
  }

  // show Filter

  const onShowFilter = () => {
    setShowFilter(true)
  }

  return (
    <div className="JFList">
      <OtherLayout>
        <OtherLayout.Main>
          <div className="container mx-auto flex flex-col space-y-2 justify-center">
            <div className="flex-col space-y-9">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl float-left">JF一覧</h1>
                <Button
                  className="float-right"
                  href="/add-jobfair"
                  type="primary"
                >
                  JF追加
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-3 items-center">
                  <p>フィルタ</p>
                  <Button
                    onClick={hideFilter}
                    type="primary"
                    style={{ display: showFilter ? 'inline' : 'none' }}
                  >
                    非表示
                  </Button>
                  <Button
                    onClick={onShowFilter}
                    type="primary"
                    style={{ display: showFilter ? 'none' : 'inline' }}
                  >
                    表示
                  </Button>
                </div>
                <div className="flex space-x-8 items-center">
                  <DatePicker
                    style={{ width: '15%', display: showFilter ? 'inline' : 'none' }}
                    inputReadOnly="true"
                    placeholder="開始日"
                    onChange={FilterStartDate}
                    format="YYYY/MM/DD"
                    dateRender={(current) => {
                      const style = {}
                      if (current.date() === 1) {
                        style.border = '1px solid #1890ff'
                        style.borderRadius = '50%'
                      }
                      return (
                        <div className="ant-picker-cell-inner" style={style}>
                          {current.date()}
                        </div>
                      )
                    }}
                  />
                  <div style={{ width: '15%', display: showFilter ? 'inline' : 'none', textAlign: 'center' }}>
                    <p>
                      推定参加学生数(
                      {rangeStudentsNumber[0]}
                      {' '}
                      ~
                      {rangeStudentsNumber[1]}
                      )
                    </p>
                    <Slider
                      range="true"
                      defaultValue={[0, 100]}
                      onAfterChange={FilterStudentsNumber}
                    />
                  </div>
                  <div style={{ width: '15%', display: showFilter ? 'inline' : 'none', textAlign: 'center' }}>
                    <p>
                      参加企業社数(
                      {rangeBussinessesNumber[0]}
                      {' '}
                      ~
                      {rangeBussinessesNumber[1]}
                      )
                    </p>
                    <Slider
                      range="true"
                      defaultValue={[0, 100]}
                      onAfterChange={FilterBussinessesNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-8 items-center justify-between">
              <div>
                <span>表示件数: </span>
                <Select value={itemCount} onChange={handleSelect}>
                  <Option value={10}>10</Option>
                  <Option value={25}>25</Option>
                  <Option value={50}>50</Option>
                </Select>
              </div>
              <Input
                className="w-1/4"
                allowClear="true"
                prefix={<SearchOutlined />}
                placeholder="JF名, 管理者"
                onChange={onSearch}
                value={valueSearch}
              />
            </div>
            <Table
              columns={columns}
              dataSource={temperaryData}
              scroll={{ y: 400 }}
              loading={loading}
              pagination={pagination}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="該当結果が見つかりませんでした" /> }}
            />
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
