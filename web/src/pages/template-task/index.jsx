

import React, { useEffect, useState } from 'react'
import { Table, Button, Slider, DatePicker, Input, Empty, Select, Tooltip } from 'antd'
import './style.scss'
import { SearchOutlined } from '@ant-design/icons'
import OtherLayout from '../../layouts/OtherLayout'
import { getTaskList, getCategories } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { filter, set } from 'lodash'

export default function TemplateTaskList() {
  // state of table
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], showTitle: false, showSizeChanger: false, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [optionMilestone, setOptionMileStone] = useState([])
  const [dataFilter, setDataFilter] = useState()
  const [optionCategory, setOptionCategory] = useState([])
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

  // add data of table
  const addDataOfTable = (response) => {
    const data = []
    for (let i = 0; i < response.data.length; i += 1) {
      data.push({
        id: i + 1,
        idTemplateTask: response.data[i].id,
        templateTaskName: response.data[i].name,
        category_name: response.data[i].categories[0].category_name,
        milestone_name: response.data[i].template_milestone.name,
      })
    }
    setTemperaryData(data)
    setOriginalData(data)
  }

  const addOptionCategory = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].category_name}>{response.data[i].category_name}</Option>
      )
    }
    setOptionCategory(option)
  }

  const addOptionMilestone = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].name}>{response.data[i].name}</Option>
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
      title: 'テンプレートタスク一名',
      width: 80,
      dataIndex: 'templateTaskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (fix) => {
        let tt = fix

        if (fix.length >= 20) {
          fix = fix.slice(1, 20) + '...';
        }
        return <Tooltip title={tt}><a href={fix}>{fix}</a></Tooltip>;
      },
    },
    {
      title: 'カテゴリ',
      width: 100,
      dataIndex: 'category_name',
      fixed: 'left'
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      width: 100,
    }
  ]

  // data of table get from database

  useEffect(async () => {
    setLoading(true)
    initPagination()
    await getTaskList().then((response) => {
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

  // Search data on Table

  const searchDataOnTable = (value) => {
    value = value.toLowerCase()
    const filteredData = originalData.filter((templateTask) => (templateTask.templateTaskName.toLowerCase().includes(value))
      && (templateTask.category_name.includes(category))
      && (templateTask.milestone_name.includes(milestone)))
    return filteredData
  }
  const onSearch = (e) => {
    const currValue = e.target.value
    if (!currValue) {
      setValueSearch('')
      setTemperaryData(dataFilter)
      return
    }
    setValueSearch(currValue)
    setTemperaryData(searchDataOnTable(currValue))
  }

  const handleSelectCategory = (value) => {
    if (!value) {
      setCategory('')
      const filteredData = originalData.filter((templateTask) => (templateTask.templateTaskName.toLowerCase().includes(valueSearch.toLowerCase()))
        && templateTask.milestone_name.includes(milestone))
      setTemperaryData(filteredData)
      setDataFilter(filteredData)
      return
    }
    setCategory(value)
    const filteredData = originalData.filter((templateTask) => (templateTask.category_name.includes(value))
      && (templateTask.templateTaskName.toLowerCase().includes(valueSearch.toLowerCase()))
      && templateTask.milestone_name.includes(milestone))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
  }

  const handlSelectMilestone = (value) => {
    if (!value) {
      setMilestone('')
      const filteredData = originalData.filter((templateTask) => (templateTask.templateTaskName.toLowerCase().includes(valueSearch.toLowerCase()))
      && templateTask.category_name.includes(category))
      setTemperaryData(filteredData)
      setDataFilter(filteredData)
      return
    }
    setMilestone(value)
    const filteredData = originalData.filter((templateTask) => (templateTask.milestone_name.includes(value))
      && (templateTask.templateTaskName.toLowerCase().includes(valueSearch.toLowerCase()))
      && templateTask.category_name.includes(category))
    setTemperaryData(filteredData)
    setDataFilter(filteredData)
  }

  return (
    <div className="TemplateTaskList">
      <OtherLayout>
        <OtherLayout.Main>
          <div className="container mx-auto flex flex-col space-y-2 justify-center">
            <div className="flex-col space-y-9">
              <div className="flex items-center">
                <h1 className="text-3xl float-left">テンプレートタスク一覧</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Select style={{ width: '15%' }} placeholder="カテゴリ" allowClear="true" onChange={handleSelectCategory}>
                  {optionCategory}
                </Select>
                <Select style={{ width: '15%' }} placeholder="マイルストーン" allowClear="true" onChange={handlSelectMilestone}>
                  {optionMilestone}
                </Select>
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
              <Input
                className="w-1/4 float-right"
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
    </div >
  )
}