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
  Tag,
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
import { jftask } from '../../api/jf-toppage'
import { deleteTask, updateManagerTask } from '../../api/task-detail'
import { loadingIcon } from '~/components/loading'
import { getCategorys } from '../../api/edit-task'

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
  const [dataCategory, setDataCategory] = useState()
  const [isEdit, setIsEdit] = useState(false)
  const [deleteOrEdit, setDeleteOrEdit] = useState(true)
  const [confirmSave, setConfirmSave] = useState(false)
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
      for (let j = 0; j < dataResponse[i].users.length; j += 1) {
        manager.push(dataResponse[i].users[j].name)
        mem.push({
          id: dataResponse[i].users[j].id,
          name: dataResponse[i].users[j].name,
        })
      }
      data.push({
        id: i + 1,
        idtask: dataResponse[i].id,
        taskName: dataResponse[i].name,
        start_date: dataResponse[i].start_time,
        end_date: dataResponse[i].end_time,
        status: dataResponse[i].status,
        category_name: dataResponse[i].categories[0]?.category_name,
        milestone_name: dataResponse[i]?.milestone.name,
        managers: manager,
        mems: mem,
        idCategory: dataResponse[i].categories[0]?.id,
      })
    }

    setTemperaryData(data)
    setOriginalData(data)
    if (valueSearch) {
      const taskNameParameter = router.query.name.toLowerCase()
      const filteredData = data.filter((task) => task.taskName.toLowerCase().includes(taskNameParameter))
      setTemperaryData(filteredData)
    }
    if (status) {
      const arrayStatus = ['全て', '未着手', '進行中', '完了', '中断', '未完了']
      const index = arrayStatus.indexOf(router.query.status)
      const arr = [0, 0, 0, 0, 0, 0]
      arr[index] = 1
      setActive(arr)
      const filteredData = data.filter((task) => !task.status.localeCompare(router.query.status))
      setTemperaryData(filteredData)
    }
  }

  const loadCategoryOptions = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].category_name}>{response.data[i].category_name}</Option>,
      )
    }
    setOptionCategory(option)
  }

  const loadMilestoneOptions = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(<Option key={response.data[i].name}>{response.data[i].name}</Option>)
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
  const saveEditNotification = () => {
    notification.success({
      duration: 3,
      message: '変更は正常に保存されました。',
      onClick: () => {},
    })
  }
  const deletetpl = async (id) => {
    setLoading(true)
    try {
      await deleteTask(id).then(() => {
        const newList = temperaryData.filter((item) => item.idtask !== id)
        setTemperaryData(newList)
        saveNotification()
      })
    } catch (error) {
      Error(error.toString())
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
    if (value) {
      setIsFilterCA(true)
    } else setIsFilterCA(false)
    setCategory(value)
    const filteredData = originalData.filter(
      (task) => (value ? !task.category_name.localeCompare(value) : task.category_name)
        && (valueSearch
          ? task.taskName.toLowerCase().includes(valueSearch.toLowerCase())
            || task.managers.some((manager) => manager.toLowerCase().includes(valueSearch.toLowerCase()))
          : task.taskName)
        && (milestone ? !task.milestone_name.localeCompare(milestone) : task.milestone_name)
        && (status ? !task.status.localeCompare(status) : task.status),
    )
    setTemperaryData(filteredData)
  }

  const handlSelectMilestone = (value) => {
    if (value) {
      setIsFilterMI(true)
    } else setIsFilterMI(false)
    setMilestone(value)
    const filteredData = originalData.filter(
      (task) => (value ? !task.milestone_name.localeCompare(value) : task.milestone_name)
        && (valueSearch
          ? task.taskName.toLowerCase().includes(valueSearch.toLowerCase())
            || task.managers.some((manager) => manager.toLowerCase().includes(valueSearch.toLowerCase()))
          : task.taskName)
        && (category ? !task.category_name.localeCompare(category) : task.category_name)
        && (status ? !task.status.localeCompare(status) : task.status),
    )
    setTemperaryData(filteredData)
  }
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/task-detail/${record.idtask}`)
    },
  })
  function tagRender(props) {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <Tag onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
        <span className="text-blue-600 icon-tag">{label}</span>
      </Tag>
    )
  }
  const handleSave = async (value, record, userAS) => {
    const defaultText = value ? value.filter((item) => typeof item === 'string') : null
    const defaultNumber = value ? value.filter((item) => typeof item === 'number') : null

    const allIdMember = []
    if (defaultText) {
      // eslint-disable-next-line array-callback-return
      record.mems.map((item) => {
        if (defaultText.includes(item.name)) {
          allIdMember.push(item.id)
        }
      })
    }

    const newData = defaultNumber ? defaultNumber.concat(allIdMember) : null
    const allNameMember = []
    if (newData) {
      // eslint-disable-next-line array-callback-return
      userAS.map((item) => {
        if (newData.includes(item.id)) {
          allNameMember.push(item.name)
        }
      })
    }
    const data = {
      assignee: newData,
    }
    const newRecord = { ...record, managers: allNameMember }
    const List = [...temperaryData]
    const newList = List.map((item) => {
      if (item.id === record.id) {
        return { ...newRecord }
      }
      return item
    })
    setTemperaryData(newList)
    // record.managers = data
    await updateManagerTask(record.idtask, data).then(() => {
      if (value !== record.managers) {
        saveEditNotification()
      }
    })
  }

  const member = (managers, record) => {
    const [edit, setEdit] = useState(false)
    const [memberAS, setMemberAS] = useState(managers)
    let userAS = []
    if (dataCategory) {
      // eslint-disable-next-line array-callback-return
      dataCategory.map((item) => {
        if (record.idCategory === item.id) {
          userAS = item.users
        }
      })
    }
    const filted = userAS.filter((e) => !managers.includes(e.name))
    return (
      <div className="listMember">
        {edit ? (
          <>
            <Select
              mode="multiple"
              onChange={(value) => {
                setIsEdit(true)
                setMemberAS(value)
              }}
              style={{ width: '100%' }}
              defaultValue={managers}
              showArrow
              // eslint-disable-next-line react/jsx-no-bind
              tagRender={tagRender}
            >
              {filted.map((item) => (
                <Select.Option className="validate-user" key={item.name} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>

            <div className="save">
              <Button
                onClick={() => {
                  setConfirmSave(false)
                  setDeleteOrEdit(true)
                  if (!isEdit) {
                    setEdit(false)
                  } else {
                    Modal.confirm({
                      title: '変更内容が保存されません。よろしいですか？',
                      icon: <ExclamationCircleOutlined />,
                      content: '',
                      centered: true,
                      onOk: () => {
                        setDeleteOrEdit(true)
                        setEdit(false)
                        setIsEdit(false)
                      },

                      onCancel: () => {
                        setDeleteOrEdit(true)
                        setIsEdit(false)
                      },
                      okText: 'はい',
                      cancelText: 'いいえ',
                    })
                  }
                }}
                style={{
                  marginRight: '10px',
                  background: 'white',
                  height: '30px',
                  padding: '0 15px',
                }}
                size="small"
                type="primary"
              >
                <span> キャンセル </span>
              </Button>
              <Button
                onClick={() => {
                  setDeleteOrEdit(true)
                  setEdit(false)
                  setConfirmSave(false)
                  handleSave(memberAS, record, userAS)
                }}
                style={{ height: '30px', padding: '0 15px' }}
                size="small"
                type="primary"
              >
                <span> 保存 </span>
              </Button>
              {' '}
            </div>
          </>
        ) : (
          <>
            {managers.length > 0 ? (
              <div
                onClick={() => {
                  setConfirmSave(true)
                  setEdit(true)
                  setDeleteOrEdit(false)
                  if (confirmSave) {
                    setEdit(false)
                  }
                }}
              >
                {' '}
                <div className="flex items-center">
                  {managers.join(', ')}
                  <EditTwoTone className="ml-1" />
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  setEdit(true)
                  setConfirmSave(true)
                  if (confirmSave) {
                    setEdit(false)
                  }
                }}
                style={{ width: '100%', height: '100%' }}
              >
                <div className="flex items-center">
                  <EditTwoTone />
                  <span style={{ color: '#999' }} className="ml-1">
                    担当者を選択してください
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
  // columns of tables
  const columns = role === 'superadmin' || role === 'admin'
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
        width: '10%',
        dataIndex: 'category_name',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
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
        width: '27%',
        dataIndex: 'managers',
        fixed: 'left',
        render: (managers, record) => member(managers, record),
      },
      {
        title: 'アクション',
        key: 'action',
        width: '10%',
        render: (_text, record) => (role === 'superadmin' || role === 'admin') && (
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
                if (deleteOrEdit) {
                  modelDelete(record.idtask)
                }
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
        width: '10%',
        dataIndex: 'category_name',
        fixed: 'left',
        render: (taskName) => <a>{taskName}</a>,
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
        width: '30%',
        dataIndex: 'managers',
        fixed: 'left',
        onCell: handleRow,
        render: (managers) => <a>{managers.join(', ')}</a>,
      },
    ]
  const fetchCTGR = async () => {
    await getCategorys().then((response) => {
      setDataCategory(response.data)
    })
  }
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
    fetchCTGR()
    await jftask(router.query.JFid).then((response) => {
      loadTableData(response)
    })
    setLoading(false)
    await getCategories().then((response) => {
      loadCategoryOptions(response)
    })
    await getAllMileStone().then((response) => {
      loadMilestoneOptions(response)
    })
    setLoading(false)
  }, [role])
  // Search data on Table
  const searchDataOnTable = (value) => {
    value = value.toLowerCase()
    const filteredData = originalData.filter(
      (task) => (value
        ? task.taskName.toLowerCase().includes(value)
            || task.managers.some((manager) => manager.toLowerCase().includes(value))
        : task.taskName)
        && (category ? !task.category_name.localeCompare(category) : task.category_name)
        && (milestone ? !task.milestone_name.localeCompare(milestone) : task.milestone_name)
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
        && (category ? !task.category_name.localeCompare(category) : task.category_name)
        && (milestone ? !task.milestone_name.localeCompare(milestone) : task.milestone_name),
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
