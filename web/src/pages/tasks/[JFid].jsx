/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useEffect, useState, useContext } from 'react'
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
  ExclamationCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import JfLayout from '../../layouts/layout-task'
import { getCategories } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { listTaskWithParent } from '../../api/jf-toppage'
import { deleteTask } from '../../api/task-detail'
import { loadingIcon } from '~/components/loading'
import EditUserAssignee from '../../components/EditUserAssignee'

function TaskList() {
  const router = useRouter()
  const { store } = useContext(ReactReduxContext)
  const [role, setRole] = useState('')
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    showTitle: false,
    showSizeChanger: false,
    pageSize: 10,
  })
  const [isFilterCA, setIsFilterCA] = useState(false)
  const [isFilterMI, setIsFilterMI] = useState(false)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [temperaryData, setTemperaryData] = useState([])
  const [optionMilestone, setOptionMileStone] = useState([])
  const [optionCategory, setOptionCategory] = useState([])
  const [status, setStatus] = useState(router.query.status)
  const [valueSearch, setValueSearch] = useState(router.query.name)
  const { Option } = Select
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
  const [active, setActive] = useState([1, 0, 0, 0, 0, 0])
  const [rowEdit, setRowEdit] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  // select number to display
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem('pagination', JSON.stringify({ ...pagination, pageSize: value }))
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
  const loadTableData = (response) => {
    const dataResponse = response ? response.data.schedule.tasks : null
    const data = []
    for (let i = 0; i < dataResponse.length; i += 1) {
      const manager = []
      const mem = []
      const categoryName = []
      const categoryId = []
      for (let j = 0; j < dataResponse[i].categories.length; j += 1) {
        categoryName.push(dataResponse[i].categories[j].category_name)
        categoryId.push(dataResponse[i].categories[j].id)
      }
      for (let j = 0; j < dataResponse[i].users.length; j += 1) {
        manager.push(dataResponse[i].users[j].name)
        mem.push({
          id: dataResponse[i].users[j].id,
          name: dataResponse[i].users[j].name,
        })
      }
      let info = {
        key: dataResponse[i].id,
        idtask: dataResponse[i].id,
        taskName: dataResponse[i].name,
        start_date: dataResponse[i].start_time,
        end_date: dataResponse[i].end_time,
        status: dataResponse[i].status,
        category_name: categoryName,
        milestone_name: dataResponse[i]?.milestone.name,
        managers: manager,
        mems: mem,
        idCategory: categoryId,
        parent_id: dataResponse[i]?.parent_id,
        is_parent: dataResponse[i]?.is_parent,
      }
      if ('children' in dataResponse[i]) {
        const children = []
        dataResponse[i].children.forEach((child) => {
          const childManager = []
          const member = []
          const childCategoryName = []
          const childCategoryId = []
          for (let j = 0; j < child.categories.length; j += 1) {
            childCategoryName.push(child.categories[j].category_name)
            childCategoryId.push(child.categories[j].id)
          }
          for (let j = 0; j < child.users.length; j += 1) {
            childManager.push(child.users[j].name)
            member.push({
              id: child.users[j].id,
              name: child.users[j].name,
            })
          }
          const childInfo = {
            key: child.id,
            idtask: child.id,
            taskName: child.name,
            start_date: child.start_time,
            end_date: child.end_time,
            status: child.status,
            category_name: childCategoryName,
            milestone_name: child?.milestone.name,
            managers: childManager,
            mems: member,
            idCategory: childCategoryId,
            parent_id: child?.parent_id,
            is_parent: child?.is_parent,
          }
          children.push(childInfo)
        })
        info = { ...info, children }
      }
      data.push(info)
    }
    setTemperaryData(data)
    setOriginalData(data)
    let filteredData = [...data]
    if (valueSearch) {
      const taskNameParameter = router.query.name.toLowerCase()
      filteredData = data.filter((task) => task.taskName.toLowerCase().includes(taskNameParameter))
      setTemperaryData(filteredData)
    }
    if (status) {
      const arrayStatus = ['全て', '未着手', '進行中', '完了', '中断', '未完了']
      const index = arrayStatus.indexOf(router.query.status)
      const arr = [0, 0, 0, 0, 0, 0]
      arr[index] = 1
      setActive(arr)
      filteredData = data.filter((task) => !task.status.localeCompare(router.query.status))
      setTemperaryData(filteredData)
    }
  }

  const loadCategoryOptions = (response) => {
    const option = []
    option.push(<Option key={0} value={0}>全て</Option>)
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option value={response.data[i].category_name}>{response.data[i].category_name}</Option>,
      )
    }
    setOptionCategory(option)
  }

  const loadMilestoneOptions = (response) => {
    const option = []
    option.push(<Option value={0}>全て</Option>)
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(<Option value={response.data[i].name}>{response.data[i].name}</Option>)
    }
    setOptionMileStone(option)
  }

  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const deletetpl = async (id) => {
    setLoading(true)
    try {
      await deleteTask(id).then(() => {
        const newList = temperaryData.filter((item) => item.idtask !== id)
        setTemperaryData(newList)
        setOriginalData(newList)
        saveNotification()
      })
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      } else Error(error.toString())
    }

    setLoading(false)
  }
  const modelDelete = (id) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: async () => {
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
    setCategory(value)
  }

  const handlSelectMilestone = (value) => {
    setMilestone(value)
  }
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/task-detail/${record.idtask}`)
    },
  })
  // columns of tables
  const columns = role === 'admin'
    ? [
      {
        title: 'タスク名',
        width: '15%',
        dataIndex: 'taskName',
        fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (taskName) => (
          <Tooltip title={taskName}>
            <a>{taskName}</a>
          </Tooltip>
        ),
        onCell: handleRow,
      },
      {
        title: '開始日',
        width: '10%',
        dataIndex: 'start_date',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: '終了日',
        width: '10%',
        dataIndex: 'end_date',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: 'スターテス',
        width: '7%',
        dataIndex: 'status',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: 'カテゴリ',
        width: '15%',
        dataIndex: 'category_name',
        fixed: 'left',
        render: (categoryName) => (
          <div className="">
            {categoryName.length > 0 ? categoryName.join(', ') : ''}
          </div>
        ),
        onCell: handleRow,
      },
      {
        title: 'マイルストーン',
        fixed: '20%',
        dataIndex: 'milestone_name',
        width: 80,
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: '担当者',
        width: '20%',
        dataIndex: 'managers',
        fixed: 'left',
        render: (managers, record) => {
          if (record.is_parent !== 1) {
            if (rowEdit === record.key) {
              return (
                <EditUserAssignee
                  setIsEdit={setIsEdit}
                  setRowEdit={setRowEdit}
                  record={record}
                  loadTableData={loadTableData}
                  setLoading={setLoading}
                />
              )
            }

            return (
              <div
                onClick={() => {
                  if (rowEdit && isEdit) {
                    Modal.confirm({
                      title: '変更内容が保存されません。よろしいですか？',
                      icon: <ExclamationCircleOutlined />,
                      content: '',
                      centered: true,
                      okText: 'はい',
                      cancelText: 'いいえ',
                      onOk: () => {
                        setRowEdit(record.key)
                        setIsEdit(false)
                      },
                    })
                  } else {
                    setRowEdit(record.key)
                  }
                }}
                className=""
              >
                { // eslint-disable-next-line consistent-return
                  managers.length > 0 ? managers.map((item) => {
                    if (item === managers[managers.length - 1]) {
                      return (
                        <span className="">

                          <span>
                            {' '}
                            {item}
                          </span>
                          <span><EditTwoTone className="ml-1" /></span>
                        </span>
                      )
                    }
                    if (item !== managers[managers.length - 1]) {
                      return (
                        <>
                          <span style={{ paddingRight: '3px' }}>
                            {item}
                            ,
                          </span>
                        </>
                      )
                    }
                  }) : (
                    <div className="flex items-center">
                      <EditTwoTone />
                      <span style={{ color: '#999' }} className="ml-1">
                        担当者を選択してください
                      </span>
                    </div>
                  )
                }
              </div>
            )
          }
          return ''
        },
      },
      {
        title: 'アクション',
        key: 'action',
        width: '10%',
        render: (_text, record) => role === 'admin' && (
          <Space size="middle">
            <EditTwoTone
              id={record.key}
              onClick={() => {
                handleEdit(record.idtask)
              }}
            />

            <DeleteTwoTone
              id={record.key}
              onClick={() => {
                modelDelete(record.idtask)
              }}
            />
          </Space>
        ),
      },
    ]
    : [
      {
        title: 'タスク名',
        width: '15%',
        dataIndex: 'taskName',
        fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (taskName) => (
          <Tooltip title={taskName}>
            <a>{taskName}</a>
          </Tooltip>
        ),
        onCell: handleRow,
      },
      {
        title: '開始日',
        width: '10%',
        dataIndex: 'start_date',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: '終了日',
        width: '10%',
        dataIndex: 'end_date',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: 'スターテス',
        width: '10%',
        dataIndex: 'status',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: 'カテゴリ',
        width: '20%',
        dataIndex: 'category_name',
        fixed: 'left',
        render: (categoryName) => (
          <div className="">
            {categoryName.length > 0 ? categoryName.join(', ') : ''}
          </div>
        ),
        onCell: handleRow,
      },
      {
        title: 'マイルストーン',
        fixed: '15%',
        dataIndex: 'milestone_name',
        width: 80,
        render: (taskName) => <a>{taskName}</a>,
        onCell: handleRow,
      },
      {
        title: '担当者',
        width: '20%',
        dataIndex: 'managers',
        fixed: 'left',
        onCell: handleRow,
        render: (managers) => (
          <div className="">
            {managers.length > 0 ? managers.join(', ') : ''}
          </div>
        ),
      },
    ]
  const getRole = () => {
    const id = router.query.JFid
    const user = store.getState().get('auth').get('user')
    const manageIds = Array.from(user.get('manage_jf_ids'))
    if (manageIds.includes(parseInt(id, 10))) {
      setRole('admin')
    } else {
      setRole(user.get('role'))
    }
  }
  useEffect(async () => {
    setLoading(true)
    getRole()
    initPagination()
    try {
      await listTaskWithParent(router.query.JFid).then((response) => {
        loadTableData(response)
      })
      await getCategories().then((response) => {
        loadCategoryOptions(response)
      })
      await getAllMileStone().then((response) => {
        loadMilestoneOptions(response)
      })
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
    setLoading(false)
  }, [role])
  const onSearch = (e) => {
    const currValue = e.target.value
    setValueSearch(currValue)
  }

  const FilterByStatus = (value) => {
    setStatus(value)
  }
  useEffect(() => {
    if (originalData.length > 0) {
      let filteredData = [...originalData]
      if (status !== '') {
        filteredData = filteredData.filter(
          (task) => (status ? !task.status.localeCompare(status) : task.status),
        )
      }
      if (valueSearch) {
        const value = valueSearch.toLowerCase()
        filteredData = filteredData.filter(
          (task) => (value
            ? task.taskName.toLowerCase().includes(value)
            || task.managers.some((manager) => manager.toLowerCase().includes(value))
            : task.taskName),
        )
      }
      if (milestone !== 0) {
        filteredData = filteredData.filter(
          (task) => (milestone ? !task.milestone_name.localeCompare(milestone) : task.milestone_name),
        )
      } else setIsFilterMI(false)
      if (category !== 0) {
        setIsFilterCA(true)
        filteredData = filteredData.filter(
          (task) => (category ? task.category_name.includes(category) : task.category_name),
        )
      } else setIsFilterCA(false)
      setLoading(false)
      setTemperaryData(filteredData)
    }
  }, [milestone, category, valueSearch, status])
  const chooseStatus = (index) => {
    setLoading(true)
    const arr = [0, 0, 0, 0, 0, 0]
    arr[index] = 1
    setActive(arr)
  }
  return (
    <JfLayout id={router.query.JFid} bgr={2}>
      <JfLayout.Main>
        <h1>タスクー覧</h1>
        <div className="TaskList">
          <div className=" justify-center">
            <div className="">
              <div className="flex-col space-y-9">
                <div className="flex justify-between">
                  <div className="flex mb-3 items-center justify-center space-x-1">
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
                <div className="flex items-center">
                  <span className="pr-3">表示件数 </span>
                  <Select size="large" value={itemCount} onChange={handleSelect}>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>
                <div className="searchAdd">
                  <Popover
                    content={(
                      <>
                        <h6 className="mb-1" style={{ fontWeight: 700 }}>
                          カテゴリ
                        </h6>

                        <Select
                          size="large"
                          placeholder="カテゴリ"
                          style={{ width: '300px' }}
                          allowClear="true"
                          onChange={handleSelectCategory}
                        >
                          {optionCategory}
                        </Select>

                        <h6 className="mb-1 mt-2" style={{ fontWeight: 700 }}>
                          マイルストーン
                          {' '}
                        </h6>

                        <Select
                          size="large"
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
                    {isFilterCA || isFilterMI || visible ? (
                      <Button
                        size="large"
                        shape="circle"
                        style={{ background: '#ffd803' }}
                        icon={<FilterOutlined id="filter" />}
                      />
                    ) : (
                      <Button size="large" shape="circle" icon={<FilterOutlined id="filter" />} />
                    )}
                  </Popover>
                  <Input
                    size="large"
                    className="mr-3"
                    allowClear="true"
                    prefix={<SearchOutlined />}
                    placeholder="タスク名, 担当者"
                    onChange={onSearch}
                    defaultValue={valueSearch}
                  />
                  {role === 'admin' ? (
                    <>
                      <Button
                        size="large"
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
              className="mt-5"
              columns={columns}
              dataSource={temperaryData}
              loading={{ spinning: loading, indicator: loadingIcon }}
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
TaskList.middleware = ['auth:superadmin', 'auth:member']
export default TaskList
