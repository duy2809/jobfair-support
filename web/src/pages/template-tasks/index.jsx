import React, { useEffect, useState } from 'react'
import { Table, Input, Empty, Popover, Modal, Select, notification, Tooltip, Button, Space } from 'antd'
import './style.scss'
import { SearchOutlined, CheckCircleTwoTone, FilterOutlined, ExclamationCircleOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useRouter } from 'next/router'
import OtherLayout from '../../layouts/OtherLayout'
import { getTaskList, getCategories, deleteTptt } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { webInit } from '../../api/web-init'

function TemplateTaskList() {
  // state of table
  const [isFilter, setIsFilter] = useState(false)
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const [users, setUsers] = useState('')
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], showTitle: false, showSizeChanger: false, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [optionMilestone, setOptionMileStone] = useState([])
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
    if (response) {
      for (let i = 0; i < response.data.length; i += 1) {
        data.push({
          id: i + 1,
          idTemplateTask: response.data[i].id,
          templateTaskName: response.data[i].name,
          category_name: response.data[i].categories[0].category_name,
          milestone_name: response.data[i].milestone.name,
        })
      }
      setTemperaryData(data)
      setOriginalData(data)
    }
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
  const handleEdit = (id) => {
    router.push(`/template-tasks/${id}/edit`)
  }
  const handleVisibleChange = () => {
    setVisible(!visible)
  }
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const deletetpl = async (id) => {
    const newList = temperaryData.filter((x) => x.idTemplateTask !== id)
    setTemperaryData(newList)
    await deleteTptt(id)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    saveNotification()
  }
  const modelDelete = (id) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deletetpl(id)
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  // columns of tables

  const columns = users === 'superadmin' ? [
    {
      title: 'テンプレートタスク名',
      dataIndex: 'templateTaskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (templateTaskName, record) => <Tooltip title={templateTaskName}><a href={`/template-task-dt/${record.idTemplateTask}`}>{templateTaskName}</a></Tooltip>,
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      render: (taskName, record) => (
        <a href={`/template-task-dt/${record.idTemplateTask}`}>{taskName}</a>
      ),
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      render: (taskName, record) => (
        <a href={`/template-task-dt/${record.idTemplateTask}`}>{taskName}</a>
      ),
    },
    {
      title: 'アクション',
      key: 'action',
      width: '10%',
      render: (_text, record) => users === 'superadmin' && (
        <Space size="middle">
          <EditTwoTone
            id={record.id}
            onClick={() => {
              handleEdit(record.idTemplateTask)
            }}
          />

          <DeleteTwoTone
            id={record.id}
            onClick={() => {
              modelDelete(record.idTemplateTask)
            }}
          />
        </Space>
      ),
    },
  ] : [
    {
      title: 'テンプレートタスク名',
      dataIndex: 'templateTaskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (templateTaskName, record) => <Tooltip title={templateTaskName}><a href={`/template-task-dt/${record.idTemplateTask}`}>{templateTaskName}</a></Tooltip>,
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      render: (taskName, record) => (
        <a href={`/template-task-dt/${record.idTemplateTask}`}>{taskName}</a>
      ),
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      render: (taskName, record) => (
        <a href={`/template-task-dt/${record.idTemplateTask}`}>{taskName}</a>
      ),
    },
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
    await webInit().then((response) => {
      setUsers(response.data.auth.user.role)
    })
      .catch((error) => Error(error.toString()))
    setLoading(false)
  }, [])

  // Search data on Table

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
    if (value) {
      setIsFilter(true)
    } else setIsFilter(false)
    setCategory(value)
    const filteredData = originalData.filter(
      (templateTask) => (value ? !templateTask.category_name.localeCompare(value) : templateTask.category_name)
        && (valueSearch ? templateTask.templateTaskName.toLowerCase().includes(valueSearch) : templateTask.templateTaskName)
        && (milestone ? !templateTask.milestone_name.localeCompare(milestone) : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }

  const handlSelectMilestone = (value) => {
    if (value) {
      setIsFilter(true)
    } else setIsFilter(false)
    setMilestone(value)
    const filteredData = originalData.filter(
      (templateTask) => (value ? !templateTask.milestone_name.localeCompare(value) : templateTask.milestone_name)
        && (valueSearch ? templateTask.templateTaskName.toLowerCase().includes(valueSearch) : templateTask.templateTaskName)
        && (category ? !templateTask.category_name.localeCompare(category) : templateTask.category_name),
    )
    setTemperaryData(filteredData)
  }
  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="TemplateTaskList">
          <div className="mx-auto flex flex-col space-y-2 justify-center">
            <div className="space-y-5">
              <div className="flex-col space-y-9">
                <div className="flex items-center">
                  <h1 className="text-3xl float-left">テンプレートタスクー覧</h1>
                </div>

              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span>表示件数 </span>
                  <Select value={itemCount} onChange={handleSelect}>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>
                <div>
                  <div className="searchAdd">
                    <Popover
                      content={(
                        <>
                          <h6 className="mb-1" style={{ fontWeight: 700 }}>カテゴリ</h6>

                          <Select style={{ width: '300px' }} className="w-1/4" placeholder="カテゴリ" allowClear="true" onChange={handleSelectCategory}>
                            {optionCategory}
                          </Select>

                          <h6 className="mb-1 mt-2" style={{ fontWeight: 700 }}>マイルストーン </h6>

                          <Select style={{ width: '300px' }} className="w-1/4" placeholder="マイルストーン" allowClear="true" onChange={handlSelectMilestone}>
                            {optionMilestone}
                          </Select>

                        </>

                      )}
                      className="mr-2"
                      placement="bottomLeft"
                      trigger="click"
                      visible={visible}
                      onVisibleChange={handleVisibleChange}
                    >
                      {visible || isFilter ? (
                        <Button
                          shape="circle"
                          style={{ color: '#ffd803' }}
                          icon={<FilterOutlined id="filter" />}
                        />
                      ) : (
                        <Button
                          shape="circle"
                          icon={<FilterOutlined id="filter" />}
                        />
                      )}
                    </Popover>
                    <Input
                      className="float-right mr-3"
                      allowClear="true"
                      prefix={<SearchOutlined />}
                      placeholder="テンプレートタスク名"
                      onChange={onSearch}
                      value={valueSearch}
                    />
                    {users === 'superadmin' ? (
                      <>
                        <Button
                          className="float-right"
                          href="/add-template-task"
                          type="primary"
                        >
                          <span> 追加 </span>
                        </Button>
                      </>
                    )
                      : null}
                  </div>

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
      </OtherLayout.Main>
    </OtherLayout>
  )
}
TemplateTaskList.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default TemplateTaskList