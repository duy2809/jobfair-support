import React, { useEffect, useState } from 'react'
import { Table, Button, Slider, DatePicker, Input, Empty, Space, Modal, notification, AutoComplete } from 'antd'
import './style.scss'
import { SearchOutlined, EditTwoTone, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import OtherLayout from '../../layouts/OtherLayout'
import { getJFList, deleteJFList } from '../../api/jf-list'
import { set } from 'lodash'

export default function JFList() {
  const openNotificationSuccess = () => {
    notification.success({
      message: 'Delete successfully',
    })
  }

  // state of table

  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [dataFilter, setDataFilter] = useState()

  // add data of table
  const addDataOfTable = (response) => {
    const data = []
    for (let i = 0; i < response.data.length; i += 1) {
      data.push({
        key: response.data[i].id,
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
      title: 'JF名',
      width: 80,
      dataIndex: 'JF名',
      key: '0',
      fixed: 'left',
      render: (name) => <a>{name}</a>,
      ellipsis: true,
    },

    {
      title: '開始日',
      width: 100,
      dataIndex: '開始日',
      key: '1',
      fixed: 'left',
    },
    {
      title: '推定参加学生数',
      dataIndex: '推定参加学生数',
      key: '2',
      width: 100,
    },
    {
      title: '参加企業社数',
      dataIndex: '参加企業社数',
      key: '3',
      width: 100,
    },
    {
      title: '管理者',
      dataIndex: '管理者',
      key: '4',
      width: 100,
    },
    {
      title: '',
      key: '5',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <Space size="middle">
          <EditTwoTone />
          <DeleteTwoTone onClick={() => {
            confirmModle(record.key)
          }}
          />
        </Space>
      ),
    },

  ]

  // data of table get from database

  useEffect(async () => {
    setLoading(true)
    await getJFList().then((response) => {
      addDataOfTable(response)
    })
      .catch((error) => {
        console.log(error)
      })
    setLoading(false)
  }, [])
  // State of filter'
  const [valueSearch, setValueSearch] = useState('')
  const [rangeStudentsNumber, setRangeStudentsNumber] = useState([0, 100])
  const [rangeBussinessesNumber, setRangeBussinessesNumber] = useState([0, 100])
  const [startDate, setStartDate] = useState('')
  // Search data on Table

  const [options, setOptions] = useState([]);

  // const searchDataOnTable = (e) => {
  //   const currValue = e.target.value
  //   setValueSearch(currValue)
  //   const filteredData = originalData.filter((JF) => (JF.JF名.includes(currValue) || JF.管理者.includes(currValue))
  //     && (JF.推定参加学生数 <= rangeStudentsNumber[1] && JF.推定参加学生数 >= rangeStudentsNumber[0])
  //     && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0])
  //     && (JF.開始日.includes(startDate)))
  //   setTemperaryData(filteredData)
  // }
  const searchDataOnTable = (value) => {
    const currValue = value
    const filteredData = originalData.filter((JF) => (JF.JF名.includes(currValue) || JF.管理者.includes(currValue))
      && (JF.推定参加学生数 <= rangeStudentsNumber[1] && JF.推定参加学生数 >= rangeStudentsNumber[0])
      && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0])
      && (JF.開始日.includes(startDate)))
    return filteredData;
  }

  const handleSearch = (value) => {
    if (!value) {
      setValueSearch('')
      setTemperaryData(dataFilter);
      return;
    }
    let filteredData = searchDataOnTable(value)
    const dataSuggest = []
    if (filteredData != null) {
      for (let i = 0; i < filteredData.length; i += 1) {
        if (filteredData[i].JF名.includes(value)) {
          dataSuggest.push(
            { value: filteredData[i].JF名 }
          )
        } else {
          dataSuggest.push(
            { value: filteredData[i].管理者 }
          )
        }
      }
    }
    setOptions(value ? dataSuggest : []);
  };

  const onSelect = (value) => {
    if (!value) {
      setValueSearch('')
      return
    }
    setValueSearch(value)
    setTemperaryData(searchDataOnTable(value));
  };


  // filter by number of students

  const FilterStudentsNumber = (value) => {
    setRangeStudentsNumber(value)
    const filteredData = originalData.filter((JF) => (JF.推定参加学生数 <= value[1] && JF.推定参加学生数 >= value[0])
      && (JF.JF名.includes(valueSearch) || JF.管理者.includes(valueSearch))
      && (JF.参加企業社数 <= rangeBussinessesNumber[1] && JF.参加企業社数 >= rangeBussinessesNumber[0])
      && (JF.開始日.includes(startDate)))
    setTemperaryData(filteredData)
    setDataFilter(filteredData);
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
          <p className="text-3xl title">
            JF一覧
            <Button
              href=""
              className="button"
              type="primary"
            >
              JF追加
            </Button>
          </p>
          <p className="filter-hide">
            フィルタ
            <Button
              className="filter-hide"
              onClick={hideFilter}
              type="primary"
              style={{ display: showFilter ? 'inline' : 'none' }}
            >
              非表示
            </Button>
            <Button
              className="filter-show"
              onClick={onShowFilter}
              type="primary"
              style={{ display: showFilter ? 'none' : 'inline' }}
            >
              表示
            </Button>
          </p>
          <DatePicker
            style={{ display: showFilter ? 'inline' : 'none' }}
            inputReadOnly="true"
            placeholder="開始日"
            onChange={FilterStartDate}
            className="filter-root"
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
          <div className="filter" style={{ display: showFilter ? 'inline' : 'none' }}>
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
          <div className="filter" style={{ display: showFilter ? 'inline' : 'none' }}>
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
          <AutoComplete
            className="search-bar"
            dropdownMatchSelectWidth={252}
            style={{ width: 300 }}
            options={options}
            onSelect={onSelect}
            onChange={handleSearch}
          >
            <Input prefix={<SearchOutlined />}
              allowClear="true"
              placeholder="JF名, 管理者"
              onPressEnter={onSelect}
            />
          </AutoComplete>
          <Table
            columns={columns}
            dataSource={temperaryData}
            rowKey={(record) => record.id}
            scroll={{ y: 360 }}
            loading={loading}
            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50'] }}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="該当結果が見つかりませんでした" /> }}
          />
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}