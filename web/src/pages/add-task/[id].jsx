import React, { useEffect, useState } from 'react'
import { Tag, Form, Input, Space, Radio, Table, Select, Tooltip, Button, List, Avatar, Modal } from 'antd'
import { CheckCircleTwoTone, SearchOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroller'
import OtherLayout from '../../layouts/OtherLayout'
import './style.scss'
import addTaskAPI from '../../api/add-task'
import { set } from 'lodash'
import ColumnGroup from 'antd/lib/table/ColumnGroup'

function index() {
  const router = useRouter()
  const [listCatergories, setlistCatergories] = useState([])
  const [listMilestones, setlistMilestones] = useState([])
  const [templateTasks, settemplateTasks] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [temperaryData, setTemperaryData] = useState([])
  const [templateTaskSelect, setTemplateTaskSelect] = useState([])
  //const [dataTable, setdataTable] = useState([])
  const [loading, setloading] = useState(true)
  const [jobfair, setJobfair] = useState([])
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
  const [valueSearch, setValueSearch] = useState('')
  // add data of table
  const addDataOfTable = (response) => {
    const data = []
    if (response) {
      for (let i = 0; i < response.data.length; i += 1) {
        data.push({
          key: response.data[i].id,
          templateTaskName: response.data[i].name,
          category_name: response.data[i].categories[0].category_name,
          milestone_name: response.data[i].milestone.name,
        })
      }
      setTemperaryData(data)
      setOriginalData(data)
    }
  }
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const jobfairInfo = await addTaskAPI.getJobfair(router.query.id)
        const categories = await addTaskAPI.getCategories()
        const milestones = await addTaskAPI.getMilestones()
        const tasks = await addTaskAPI.getAllTemplateTasks()
        setlistCatergories((categories.data))
        setlistMilestones(Array.from(milestones.data))
        setJobfair((jobfairInfo.data))
        settemplateTasks(Array.from(tasks.data))
        addDataOfTable(tasks)
        setloading(false)
        return null
      } catch (error) {
        return Error(error.toString())
      }
    }
    fetchAPI()
  }, [])

  const columns = [
    {
      title: 'Full Name',
      width: 100,
      dataIndex: 'templateTaskName',
      fixed: 'left',
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
    },]
  const searchDataOnTable = (value) => {
    const filteredData = originalData.filter(
      (templateTask) => (value ? templateTask.templateTaskName.toLowerCase().includes(value) : templateTask.templateTaskName)
        && (category ? !templateTask.category_name.localeCompare(category) : templateTask.category_name)
        && (milestone ? !templateTask.milestone_name.localeCompare(milestone) : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }
  const onSearch = (e) => {
    const currValue = e.target.value.toLowerCase()
    setValueSearch(currValue)
    searchDataOnTable(currValue)
  }

  const handleSelectCategory = (value) => {
    setCategory(value)
    const filteredData = originalData.filter(
      (templateTask) => (value ? !templateTask.category_name.localeCompare(value) : templateTask.category_name)
        && (valueSearch ? templateTask.templateTaskName.toLowerCase().includes(valueSearch) : templateTask.templateTaskName)
        && (milestone ? !templateTask.milestone_name.localeCompare(milestone) : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }

  const handlSelectMilestone = (value) => {
    setMilestone(value)
    const filteredData = originalData.filter(
      (templateTask) => (value ? !templateTask.milestone_name.localeCompare(value) : templateTask.milestone_name)
        && (valueSearch ? templateTask.templateTaskName.toLowerCase().includes(valueSearch) : templateTask.templateTaskName)
        && (category ? !templateTask.category_name.localeCompare(category) : templateTask.category_name),
    )
    setTemperaryData(filteredData)
  }
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setTemplateTaskSelect(selectedRowKeys)
    }
  };
  const cancelConfirmModle = () => {
      if (!templateTaskSelect) {
        return;
      }
      return Modal.confirm({
        title: '入力内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
         // onFormReset()
          //routeTo('')
        },
        onCancel: () => {},
        okText: 'はい',
        centered: true,
        cancelText: 'いいえ',
      })
  }
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に登録されました。',
      onClick: () => {},
    })
  }
  const addTask = async () => {
    try {
      console.log(templateTaskSelect)
      const data = {data: templateTaskSelect}
      console.log(data);
      const response = await addTaskAPI.addTasks(jobfair.id, data)
      console.log(response)
      if (response.status < 299) {
        await saveNotification()
        //routeTo(`/jf-toppage/${response.data.id}`)
      } else {
        //setdisableBtn(false)
      }
    } catch (error) {
      
    }
  }
  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="add-task-page">
          <div className="page-title">
            <h1>
              夕スク登録
              <Tag
                className="ml-4 text-sm p-1 "
                color="#55acee"
                icon={loading ? <SyncOutlined spin /> : ''}
              >
                {loading ? 'processing' : jobfair.name}
              </Tag>
            </h1>

          </div>
          <div className="container mx-auto w-3/4">
            <div className="grid grid-cols-1 grid-flow-row justify-center">

              {/* task header */}
              <div className="header flex justify-between mb-6 " style={{ flex: '0 0 100%' }}>
                  <div className="flex space-x-2" style={{ flex: '0 0 70%' }}>
                    <Select
                      showSearch
                      size="large"
                      showArrow
                      allowClear
                      className="w-1/4"
                      placeholder="カテゴリ"
                      onChange={handleSelectCategory}
                    >
                      {listCatergories.map((element) => (
                        <Select.Option key={element.id} value={element.category_name}>
                          {element.category_name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Select
                      showSearch
                      size="large"
                      showArrow
                      allowClear
                      onChange={handlSelectMilestone}
                      className="w-1/4"
                      placeholder="マイルストーン"
                    //   onChange={filterSelectedTasks}
                    >
                      {listMilestones.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="search-input">
                    <Input
                      size="large"
                      className="search-input"
                      allowClear="true"
                      prefix={<SearchOutlined />}
                      placeholder="テンプレートタスク名"
                      onChange={onSearch}
                    />
                  </div>
              </div>
              {/* list body */}
              <div className="list-task rounded-sm border border-gray-300 mb-8">

                <Table
                  rowSelection={rowSelection}
                  // {...this.state}
                  pagination={false}
                  columns={columns}
                  dataSource={temperaryData}
                // scroll={scroll}
                />
              </div>
              {/* 2 button */}
              <div className="data-controller mr-5">
                <Space size={20} className="flex justify-end">
                  <Button
                    htmlType="button"
                    className="ant-btn"
                   onClick={cancelConfirmModle}
                  // disabled={disableBtn}
                  // loading={disableBtn}
                  >
                    キャンセル
                  </Button>
                  {/* --------------------------- */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={addTask}
                    // disabled={disableBtn}
                    // loading={disableBtn}
                    style={{ letterSpacing: '-1px' }}
                  >
                    登録
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </OtherLayout.Main>
    </OtherLayout>
  )
}

export default index
