import React, { useEffect, useState } from 'react'
import {
  Table,
  Input,
  Modal,
  Popover,
  Empty,
  Select,
  Tooltip,
  Button,
  Space,
  notification,
} from 'antd'
import './style.scss'
import { useRouter } from 'next/router'
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons'
import JfLayout from '../../layouts/layout-task'
import { getCategories } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { jftask } from '../../api/jf-toppage'
import { webInit } from '../../api/web-init'
import { deleteTask } from '../../api/task-detail'

function TaskList() {
  const router = useRouter()
  const [users, setUsers] = useState('')
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    showTitle: false,
    showSizeChanger: false,
    pageSize: 10,
  })
  const [isFilter, setIsFilter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [optionMilestone, setOptionMileStone] = useState([])
  const [optionCategory, setOptionCategory] = useState([])
  const [status, setStatus] = useState(router.query.status)
  const [valueSearch, setValueSearch] = useState(router.query.name)
  const { Option } = Select
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
  const [active, setActive] = useState([1, 0, 0, 0, 0, 0])
  // select number to display
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem(
      'pagination',
      JSON.stringify({ ...pagination, pageSize: value }),
    )
  }
  const handleVisibleChange = () => {
    setVisible(!visible)
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
    const dataResponse = response.data.schedule.tasks
    const data = []
    for (let i = 0; i < dataResponse.length; i += 1) {
      const manager = []
      for (let j = 0; j < dataResponse[i].users.length; j += 1) {
        manager.push(dataResponse[i].users[j].name)
      }
      data.push({
        id: i + 1,
        idtask: dataResponse[i].id,
        taskName: dataResponse[i].name,
        start_date: dataResponse[i].start_time,
        end_date: dataResponse[i].end_time,
        status: dataResponse[i].status,
        category_name: dataResponse[i].categories[0].category_name,
        milestone_name: dataResponse[i].milestone.name,
        managers: manager,
      })
    }
    console.log(temperaryData)
    setTemperaryData(data)
    setOriginalData(data)
    if (valueSearch) {
      const taskNameParameter = router.query.name.toLowerCase()
      const filteredData = data.filter((task) => task.taskName.toLowerCase().includes(taskNameParameter))
      setTemperaryData(filteredData)
    }
    if (status) {
      const arrayStatus = [
        '全て',
        '未着手',
        '進行中',
        '完了',
        '中断',
        '未完了',
      ]
      const index = arrayStatus.indexOf(router.query.status)
      const arr = [0, 0, 0, 0, 0, 0]
      arr[index] = 1
      setActive(arr)
      const filteredData = data.filter(
        (task) => !task.status.localeCompare(router.query.status),
      )
      setTemperaryData(filteredData)
    }
  }

  const addOptionCategory = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].category_name}>
          {response.data[i].category_name}
        </Option>,
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

  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const deletetpl = async (id) => {
    const newList = temperaryData.filter((x) => x.idtask !== id)
    setTemperaryData(newList)
    await deleteTask(id)
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
  const handleEdit = (id) => {
    router.push(`/edit-task/${id}`)
  }
  const handleSelectCategory = (value) => {
    if (value) {
      setIsFilter(true)
    } else setIsFilter(false)
    setCategory(value)
    const filteredData = originalData.filter(
      (task) => (value
        ? !task.category_name.localeCompare(value)
        : task.category_name)
        && (valueSearch
          ? task.taskName.toLowerCase().includes(valueSearch.toLowerCase())
            || task.managers.some((manager) => manager.toLowerCase().includes(valueSearch.toLowerCase()))
          : task.taskName)
        && (milestone
          ? !task.milestone_name.localeCompare(milestone)
          : task.milestone_name)
        && (status ? !task.status.localeCompare(status) : task.status),
    )
    setTemperaryData(filteredData)
  }

  const handlSelectMilestone = (value) => {
    if (value) {
      setIsFilter(true)
    } else setIsFilter(false)
    setMilestone(value)
    const filteredData = originalData.filter(
      (task) => (value
        ? !task.milestone_name.localeCompare(value)
        : task.milestone_name)
        && (valueSearch
          ? task.taskName.toLowerCase().includes(valueSearch.toLowerCase())
            || task.managers.some((manager) => manager.toLowerCase().includes(valueSearch.toLowerCase()))
          : task.taskName)
        && (category
          ? !task.category_name.localeCompare(category)
          : task.category_name)
        && (status ? !task.status.localeCompare(status) : task.status),
    )
    setTemperaryData(filteredData)
  }

  // columns of tables
  const columns = users === 'superadmin' || users === 'admin' ? [
    {
      title: 'タスク名',
      width: '15%',
      dataIndex: 'taskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (taskName, record) => (
        <Tooltip title={taskName}>
          <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
        </Tooltip>
      ),
    },
    {
      title: '開始日',
      width: '10%',
      dataIndex: 'start_date',
      fixed: 'left',
      render: (taskName, record) => (
        <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
      ),
    },
    {
      title: '終了日',
      width: '10%',
      dataIndex: 'end_date',
      fixed: 'left',
      render: (taskName, record) => (
        <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
      ),
    },
    {
      title: 'スターテス',
      width: '7%',
      dataIndex: 'status',
      fixed: 'left',
      render: (taskName, record) => (
        <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
      ),
    },
    {
      title: 'カテゴリ',
      width: '10%',
      dataIndex: 'category_name',
      fixed: 'left',
      render: (taskName, record) => (
        <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
      ),
    },
    {
      title: 'マイルストーン',
      fixed: '30%',
      dataIndex: 'milestone_name',
      width: 80,
      render: (taskName, record) => (
        <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
      ),
    },
    {
      title: '担当者',
      width: '17%',
      dataIndex: 'managers',
      fixed: 'left',
      render: (managers) => (managers ? <a>{managers.join(', ')}</a> : <span />),
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
              handleEdit(record.idtask)
            }}
          />

          <DeleteTwoTone
            id={record.id}
            onClick={() => {
              modelDelete(record.idtask)
            }}
          />
        </Space>
      ),
    },
  ] : [{
    title: 'タスク名',
    width: '15%',
    dataIndex: 'taskName',
    fixed: 'left',
    ellipsis: {
      showTitle: false,
    },
    render: (taskName, record) => (
      <Tooltip title={taskName}>
        <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
      </Tooltip>
    ),
  },
  {
    title: '開始日',
    width: '10%',
    dataIndex: 'start_date',
    fixed: 'left',
    render: (taskName, record) => (
      <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
    ),
  },
  {
    title: '終了日',
    width: '10%',
    dataIndex: 'end_date',
    fixed: 'left',
    render: (taskName, record) => (
      <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
    ),
  },
  {
    title: 'スターテス',
    width: '7%',
    dataIndex: 'status',
    fixed: 'left',
    render: (taskName, record) => (
      <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
    ),
  },
  {
    title: 'カテゴリ',
    width: '10%',
    dataIndex: 'category_name',
    fixed: 'left',
    render: (taskName, record) => (
      <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
    ),
  },
  {
    title: 'マイルストーン',
    fixed: '30%',
    dataIndex: 'milestone_name',
    width: 80,
    render: (taskName, record) => (
      <a href={`/task-detail/${record.idtask}`}>{taskName}</a>
    ),
  },
  {
    title: '担当者',
    width: '17%',
    dataIndex: 'managers',
    fixed: 'left',
    render: (managers) => (managers ? <a>{managers.join(', ')}</a> : <span />),
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
    await webInit()
      .then((response) => {
        setUsers(response.data.auth.user.role)
      })
      .catch((error) => Error(error.toString()))
    setLoading(false)
  }, [])

  // Search data on Table
  const searchDataOnTable = (value) => {
    value = value.toLowerCase()
    const filteredData = originalData.filter(
      (task) => (value
        ? task.taskName.toLowerCase().includes(value)
            || task.managers.some((manager) => manager.toLowerCase().includes(value))
        : task.taskName)
        && (category
          ? !task.category_name.localeCompare(category)
          : task.category_name)
        && (milestone
          ? !task.milestone_name.localeCompare(milestone)
          : task.milestone_name)
        && (status ? !task.status.localeCompare(status) : task.status),
    )
    setTemperaryData(filteredData)
  }
  const onSearch = (e) => {
    const currValue = e.target.value
    setValueSearch(currValue)
    searchDataOnTable(currValue)
  }

  const FilterByStatus = (value) => {
    setStatus(value)
    const filteredData = originalData.filter(
      (task) => (value ? !task.status.localeCompare(value) : task.status)
        && (valueSearch
          ? task.taskName.toLowerCase().includes(valueSearch.toLowerCase())
            || task.managers.some((manager) => manager.toLowerCase().includes(valueSearch.toLowerCase()))
          : task.taskName)
        && (category
          ? !task.category_name.localeCompare(category)
          : task.category_name)
        && (milestone
          ? !task.milestone_name.localeCompare(milestone)
          : task.milestone_name),
    )
    setTemperaryData(filteredData)
    setLoading(false)
  }
  // const [active] = useState([1, 0, 0, 0, 0])
  const chooseStatus = (index) => {
    setLoading(true)
    const arr = [0, 0, 0, 0, 0, 0]
    arr[index] = 1
    setActive(arr)
  }
  return (
    <JfLayout id={router.query.JFid}>
      <JfLayout.Main>
        <div className="TaskList">
          <div className="space-y-2 justify-center">
            <div className="space-y-2">
              <div className="flex-col space-y-9">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl float-left">タスクー覧</h1>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center justify-center space-x-1">
                    <div>スターテス</div>
                    <Button
                      type="text"
                      className={active[0] ? 'active' : ''}
                      onClick={() => {
                        chooseStatus(0)
                        FilterByStatus('')
                      }}
                    >
                      全て
                    </Button>
                    <Button
                      type="text"
                      className={active[1] ? 'active' : ''}
                      onClick={() => {
                        chooseStatus(1)
                        FilterByStatus('未着手')
                      }}
                    >
                      未着手
                    </Button>
                    <Button
                      type="text"
                      className={active[2] ? 'active' : ''}
                      onClick={() => {
                        chooseStatus(2)
                        FilterByStatus('進行中')
                      }}
                    >
                      進行中
                    </Button>
                    <Button
                      type="text"
                      className={active[3] ? 'active' : ''}
                      onClick={() => {
                        chooseStatus(3)
                        FilterByStatus('完了')
                      }}
                    >
                      完了
                    </Button>
                    <Button
                      type="text"
                      className={active[4] ? 'active' : ''}
                      onClick={() => {
                        chooseStatus(4)
                        FilterByStatus('中断')
                      }}
                    >
                      中断
                    </Button>
                    <Button
                      type="text"
                      className={active[5] ? 'active' : ''}
                      onClick={() => {
                        chooseStatus(5)
                        FilterByStatus('未完了')
                      }}
                    >
                      未完了
                    </Button>
                  </div>
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
                <div className="searchAdd">
                  <Popover
                    content={(
                      <>
                        <h6 className="mb-1" style={{ fontWeight: 700 }}>カテゴリ</h6>

                        <Select
                          placeholder="カテゴリ"
                          style={{ width: '300px' }}
                          allowClear="true"
                          onChange={handleSelectCategory}

                        >
                          {optionCategory}
                        </Select>

                        <h6 className="mb-1 mt-2" style={{ fontWeight: 700 }}>マイルストーン </h6>

                        <Select
                          placeholder="マイルストーン"
                          style={{ width: '300px' }}
                          allowClear="true"
                          onChange={handlSelectMilestone}
                        >
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
                    placeholder="タスク名, 担当者"
                    onChange={onSearch}
                    defaultValue={valueSearch}
                  />
                  {users === 'superadmin' ? (
                    <>
                      <Button
                        className="float-right"
                        href={`/add-task/${router.query.JFid}`}
                        type="primary"
                      >
                        <span> 追加 </span>
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={temperaryData}
              loading={loading}
              pagination={pagination}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="該当結果が見つかりませんでした"
                  />
                ),
              }}
            />
          </div>
        </div>
      </JfLayout.Main>
    </JfLayout>
  )
}
TaskList.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default TaskList
