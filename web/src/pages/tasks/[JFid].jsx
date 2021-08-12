import React, { useEffect, useState } from 'react'
import { Table, Input, Empty, Select, Tooltip, Button } from 'antd'
import './style.scss'
import { useRouter } from 'next/router'
import { SearchOutlined } from '@ant-design/icons'
import JfLayout from '../../layouts/JFLayout'
import { getCategories } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { jftask } from '../../api/jf-toppage'
import { set } from 'lodash'

export default function TaskList() {
  const router = useRouter()
  // state of table
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], showTitle: false, showSizeChanger: false, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [optionMilestone, setOptionMileStone] = useState([])
  const [dataFilter, setDataFilter] = useState()
  const [optionCategory, setOptionCategory] = useState([])
  const [status, setStatus] = useState('')
  const [valueSearch, setValueSearch] = useState('')
  const { Option } = Select
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
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

  //add data of table
  const addDataOfTable = (response) => {
    const category = ['1次面接練習', 'TC業務', '企業担当', '管理者']
    const milestone = ['会社紹介', 'オープンSCP', 'プロファイル選択ラウンドの結果', '1回目の面接', ' 1回目の面接結果', '2回目の面接']
    const data = []
    for (let i = 0; i < response.data.data[0].tasks.length; i += 1) {
      const index1 = Math.floor((Math.random() * 10) % (category.length - 1))
      const index2 = Math.floor((Math.random() * 10) % (milestone.length - 1))
      data.push({
        id: i + 1,
        idtask: response.data.data[0].tasks[i].id,
        taskName: response.data.data[0].tasks[i].name,
        time: '',
        status: response.data.data[0].tasks[i].status,
        category_name: category[index1],
        milestone_name: milestone[index2],
        manager: response.data.data[0].tasks[i].name
      })
    }
    setTemperaryData(data)
    setOriginalData(data)
    setDataFilter(data)
  }

  const addOptionCategory = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].category_name}>{response.data[i].category_name}</Option>,
      )
    }
    setOptionCategory(option)
  }

  const addOptionMilestone = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].name}>{response.data[i].name}</Option>,
      )
    }
    setOptionMileStone(option)
  }

  // columns of tables

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      fixed: 'left',
      width: '5%',
      render: (id) => id,
    },
    {
      title: 'タスク名',
      width: 80,
      dataIndex: 'taskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (taskName, record) => <Tooltip title={taskName}><a href={``}>{taskName}</a></Tooltip>,
    },
    {
      title: '開始日',
      width: 50,
      dataIndex: 'time',
      fixed: 'left',
    },
    {
      title: '最終日',
      width: 50,
      dataIndex: 'time',
      fixed: 'left',
    },
    {
      title: 'ステータス',
      width: 80,
      dataIndex: 'status',
      fixed: 'left',
    },
    {
      title: 'カテゴリ',
      width: 100,
      dataIndex: 'category_name',
      fixed: 'left',
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      width: 100,
    },
    {
      title: '担当者',
      width: 100,
      dataIndex: 'manager',
      fixed: 'left',
    },
  ]

  // data of table get from database

  useEffect(async () => {
    setLoading(true)
    initPagination()
    await jftask(router.query.JFid).then((response) => {
      addDataOfTable(response)
    })
    await getCategories().then((response) => {
      addOptionCategory(response)
    })
    await getAllMileStone().then((response) => {
      addOptionMilestone(response)
    })
      .catch((error) => Error(error.toString()))
    setLoading(false)
  }, [itemCount])

  const stateOfFilter = () => {

  }
  // Search data on Table

  const searchDataOnTable = (value) => {
    value = value.toLowerCase()
    const filteredData = originalData.filter((task) => (value? task.taskName.toLowerCase().includes(value.toLowerCase()): task.taskName)
      && (category? !task.category_name.localeCompare(category) : task.category_name)
      && (milestone? !task.milestone_name.localeCompare(milestone) : task.milestone_name)
      && (status? !task.status.localeCompare(status): task.status))
    return filteredData
  }
  const onSearch = (e) => {
    const currValue = e.target.value
    setValueSearch(currValue)
    setTemperaryData(searchDataOnTable(currValue))
  }

  const handleSelectCategory = (value) => {
    setCategory(value)
    const filteredData = originalData.filter((task) => (value? !task.category_name.localeCompare(value) : task.category_name)
      && (valueSearch? task.taskName.toLowerCase().includes(valueSearch.toLowerCase()): task.taskName)
      && (milestone? !task.milestone_name.localeCompare(milestone) : task.milestone_name)
      && (status? !task.status.localeCompare(status): task.status))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
  }

  const handlSelectMilestone = (value) => {
    // if (!value) {
    //   setMilestone('')
    //   const filteredData = originalData.filter((task) => (task.taskName.toLowerCase().includes(valueSearch.toLowerCase()))
    //     && task.category_name.includes(category)
    //     && task.status.includes(status))
    //   setTemperaryData(filteredData)
    //   setDataFilter(filteredData)
    //   return
    // }
    setMilestone(value)
    const filteredData = originalData.filter((task) => (value? !task.milestone_name.localeCompare(value) : task.milestone_name)
      && (valueSearch? task.taskName.toLowerCase().includes(valueSearch.toLowerCase()): task.taskName)
      && (category? !task.category_name.localeCompare(category) : task.category_name)
      && (status? !task.status.localeCompare(status): task.status))
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
  const [active, setActive] = useState([1, 0, 0, 0, 0])
  // const [active] = useState([1, 0, 0, 0, 0])
  const chooseStatus = (index) => {
    setLoading(true)
    var arr = [0, 0, 0, 0, 0]
    arr[index] = 1
    setActive(arr)
  }
  const FilterByStatus = (value) => {
    // if (!value) {
    //   setStatus('')
    //   const filteredData = originalData.filter((task) => (task.taskName.toLowerCase().includes(valueSearch.toLowerCase()))
    //     && task.category_name.includes(category)
    //     && task.milestone_name.includes(milestone))
    //   setTemperaryData(filteredData)
    //   setDataFilter(filteredData)
    //   setLoading(false)
    //   return
    // }
    setStatus(value)
    const filteredData = originalData.filter((task) => (value? !task.status.localeCompare(value): task.status)
    && (valueSearch? task.taskName.toLowerCase().includes(valueSearch.toLowerCase()): task.taskName)
    && (category? !task.category_name.localeCompare(category) : task.category_name)
    && (milestone? !task.milestone_name.localeCompare(milestone) : task.milestone_name))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
    setLoading(false)
  }
  return (
    <JfLayout>
      <JfLayout.Main>
        <div className="TaskList">
          <div className="container mx-auto flex flex-col space-y-2 justify-center">
            <div className="space-y-2">
              <div className="flex-col space-y-3">
                <div className="flex items-center">
                  <h1 className="text-3xl float-left">タスクー覧</h1>
                </div>
                <div className="flex items-center space-x-3">
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
                <div className="flex justify-between">
                  <div className="flex items-center space-x-1" >
                    <b style={{ display: showFilter ? 'inline' : 'none' }}>スターテス:</b>
                    <Button style={{ display: showFilter ? 'inline' : 'none' }} type="text" className={active[0] ? 'active' : ''} onClick={() => { chooseStatus(0); FilterByStatus('') }}>全て</Button>
                    <Button style={{ display: showFilter ? 'inline' : 'none' }} type="text" className={active[1] ? 'active' : ''} onClick={() => { chooseStatus(1); FilterByStatus('未着手') }}>未着手</Button>
                    <Button style={{ display: showFilter ? 'inline' : 'none' }} type="text" className={active[2] ? 'active' : ''} onClick={() => { chooseStatus(2); FilterByStatus('進行中') }}>進行中</Button>
                    <Button style={{ display: showFilter ? 'inline' : 'none' }} type="text" className={active[3] ? 'active' : ''} onClick={() => { chooseStatus(3); FilterByStatus('完了') }}>完了</Button>
                    <Button style={{ display: showFilter ? 'inline' : 'none' }} type="text" className={active[4] ? 'active' : ''} onClick={() => { chooseStatus(4); FilterByStatus('中断') }}>中断</Button>
                    <Button style={{ display: showFilter ? 'inline' : 'none' }} type="text" className={active[5] ? 'active' : ''} onClick={() => { chooseStatus(5); FilterByStatus('未完了') }}>未完了</Button>
                  </div>
                  <Button
                    className="flex float-right"
                    href="/add-template-task"
                    type="primary"
                  >
                    追加
                  </Button>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4 w-9/12">
                    <Select style={{ display: showFilter ? 'inline' : 'none' }} className="w-1/4 items-center" placeholder="カテゴリ" allowClear="true" onChange={handleSelectCategory}>
                      {optionCategory}
                    </Select>
                    <Select style={{ display: showFilter ? 'inline' : 'none' }} className="w-1/4 items-center" placeholder="マイルストーン" allowClear="true" onChange={handlSelectMilestone}>
                      {optionMilestone}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span>表示件数: </span>
                  <Select value={itemCount} onChange={handleSelect}>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>
                <div>
                  <Input
                    className="float-right"
                    allowClear="true"
                    prefix={<SearchOutlined />}
                    placeholder="タスク名"
                    onChange={onSearch}
                  />
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={temperaryData}
              loading={loading}
              pagination={pagination}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="該当結果が見つかりませんでした" /> }}
            />
          </div>
        </div>
      </JfLayout.Main>
    </JfLayout>
  )
}
