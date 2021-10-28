import React, { useEffect, useState } from 'react'
import { Table, Input, Empty, Popover, Modal, Select, notification, Tooltip, Button, Space } from 'antd'
import './style.scss'
import { SearchOutlined, CheckCircleTwoTone, FilterOutlined, ExclamationCircleOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useRouter } from 'next/router'
import OtherLayout from '../../layouts/OtherLayout'
import { getTaskList, getCategories, deleteTptt } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { webInit } from '../../api/web-init'
import { loadingIcon } from '../../components/loading'

function TemplateTaskList() {
  // state of table
  const [isFilterCA, setIsFilterCA] = useState(false)
  const [isFilterCI, setIsFilterCI] = useState(false)
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
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/template-task-dt/${record.idTemplateTask}`)
    },
  })
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
        if (response.data[i].categories[0] && response.data[i].milestone) {
          data.push({
            id: i + 1,
            idTemplateTask: response.data[i].id,
            templateTaskName: response.data[i].name,
            category_name: response.data[i].categories[0].category_name,
            milestone_name: response.data[i].milestone.name,
          })
        }
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
      onClick: () => { },
    })
  }
  const deletetpl = async (id) => {
    const newList = temperaryData.filter((x) => x.idTemplateTask !== id)
    setTemperaryData(newList)
    await deleteTptt(id)
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
      onCancel: () => { },
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
      render: (templateTaskName) => <Tooltip title={templateTaskName}><a>{templateTaskName}</a></Tooltip>,
      onCell: handleRow,
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (categoryName) => (
        <Tooltip title={categoryName}>
          <a>{categoryName}</a>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      ellipsis: {
        showTitle: false,
      },
      render: (milestoneName) => (
        <Tooltip title={milestoneName}>
          <a>{milestoneName}</a>
        </Tooltip>
      ),
      onCell: handleRow,
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
      render: (templateTaskName) => <Tooltip title={templateTaskName}><a>{templateTaskName}</a></Tooltip>,
      onCell: handleRow,
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      render: (taskName) => (
        <a>{taskName}</a>
      ),
      onCell: handleRow,
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      render: (taskName) => (
        <a>{taskName}</a>
      ),
      onCell: handleRow,
    },
  ]

  // data of table get from database

  useEffect(async () => {
    setLoading(true)
    initPagination()
    await getTaskList().then((response) => {
      addDataOfTable(response)
    })
    await getAllMileStone().then((response) => {
      addOptionMilestone(response)
    })
    await webInit().then((response) => {
      setUsers(response.data.auth.user.role)
    })
      .catch((error) => Error(error.toString()))
    setLoading(false)
    await getCategories().then((response) => {
      addOptionCategory(response)
    })
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
      setIsFilterCA(true)
    } else setIsFilterCA(false)
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
      setIsFilterCI(true)
    } else setIsFilterCI(false)
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
        <h1>テンプレートタスクー覧</h1>
        <div className="TemplateTaskList">
          <div className="mx-auto flex flex-col justify-center">
            <div className="">
              <div className="flex items-center justify-between">
                <div>
                  <span className="pr-3">表示件数</span>
                  <Select size="large" value={itemCount} onChange={handleSelect}>
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

                          <Select style={{ width: '300px' }} size="large" placeholder="カテゴリ" allowClear="true" onChange={handleSelectCategory}>
                            {optionCategory}
                          </Select>

                          <h6 className="mb-1 mt-2" style={{ fontWeight: 700 }}>マイルストーン </h6>

                          <Select style={{ width: '300px' }} size="large" placeholder="マイルストーン" allowClear="true" onChange={handlSelectMilestone}>
                            {optionMilestone}
                          </Select>

                        </>

                      )}
                      className="mr-2 p-2"
                      placement="bottomLeft"
                      trigger="click"
                      visible={visible}
                      onVisibleChange={handleVisibleChange}
                    >
                      {isFilterCA || isFilterCI || visible ? (
                        <Button
                          size="large"
                          shape="circle"
                          style={{ background: '#ffd803' }}
                          icon={<FilterOutlined id="filter" />}
                        />
                      ) : (
                        <Button
                          size="large"
                          shape="circle"
                          icon={<FilterOutlined id="filter" />}
                        />
                      )}
                    </Popover>
                    <Input
                      size="large"
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
                          size="large"
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
              className="mt-5"
              columns={columns}
              dataSource={temperaryData}
              loading={{ spinning: loading, indicator: loadingIcon }}
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
