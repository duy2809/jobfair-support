import React, { useState, useEffect, useCallback } from 'react'
import { Select, Table, Modal, Input, Button, Empty, Tooltip, Space, notification } from 'antd'
import { DeleteTwoTone, EditTwoTone, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Layout from '../../layouts/OtherLayout'
import { formatDate } from '~/utils/utils'
import { MemberApi } from '~/api/member'
import { webInit } from '~/api/web-init'
import { deleteMember } from '~/api/member-detail'
import './styles.scss'

function MemberList() {
  const [members, setMembers] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [filterData, setFilterData] = useState([])
  const [user, setUser] = useState({})
  const [dataLoading, setDataLoading] = useState(false)
  const [role, setRole] = useState()
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  webInit().then(() => {
    setRole(user.role)
  })
  const router = useRouter()
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

  const handleChange = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: e.current,
    }))
  }

  const handleInput = (e) => {
    const result = members.filter(
      (obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    )
    setFilterData(result)
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

  const fetchData = useCallback(() => {
    setDataLoading(true)
    initPagination()
    webInit().then((res) => {
      if (res.data.auth !== null) {
        setUser(res.data.auth.user)
      }
    })
    MemberApi.getListMember()
      .then((res) => {
        const { data } = res
        setMembers(data)
        setFilterData(data)
      })
      .finally(() => {
        setDataLoading(false)
      })
  })
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/member/${record.id}`)
    },
  })
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/member/invite')
  }
  const [id, setId] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalType, setIsModalType] = useState({
    delete: false,
    edit: false,
  })
  const openNotificationSuccess = () => {
    notification.success({
      message: 'メンバを正常に削除されました',
      duration: 3,
    })
  }
  const handleOk = async () => {
    setIsModalVisible(false)
    try {
      if (isModalType.delete) {
        await deleteMember(id)
        setPagination((preState) => ({
          ...preState,
          current: 1,
        }))

        setId(null)
        openNotificationSuccess()
        fetchData()
        setIsModalType((preState) => ({ ...preState, delete: false }))
      }

      if (isModalType.edit) {
        setIsModalType((preState) => ({ ...preState, edit: false }))
        window.location.href = `/member/${id}/edit`
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
    setIsModalType({ delete: false, edit: false })
  }
  const showModal = (type) => {
    setIsModalVisible(true)
    let title
    if (type.edit) {
      title = 'メンバを編集しますか?'
    } else {
      title = 'メンバを削除してもよろしいですか?'
    }
    Modal.confirm({
      centered: true,
      title,
      visible: isModalVisible,
      onOk() {
        handleOk()
      },
      onCancel() {
        handleCancel()
      },
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  const handleEdit = (idMb) => {
    router.push(`/member/${idMb}/edit`)
  }
  const columns = [
    {
      title: 'メンバ名',
      dataIndex: 'name',
      key: 'メンバ名',
      width: '30%',
      render: (taskName) => (
        <Tooltip title={taskName}>
          <a>{taskName}</a>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'メールアドレス',
      key: 'メールアドレス',
      dataIndex: 'email',
      width: '40%',
      render: (taskName) => <a>{taskName}</a>,
      onCell: handleRow,
    },
    {
      title: '参加日',
      dataIndex: 'date',
      width: `${role === 'superadmin' ? '20%' : '30%'}`,
      key: '参加日',
      render: (taskName) => <a>{formatDate(taskName)}</a>,
      onCell: handleRow,
    },
    {
      title: `${role === 'superadmin' ? 'アクション' : ''}`,
      key: 'action',
      width: `${role === 'superadmin' ? '10%' : '0%'}`,
      render: (_text, record) => (role === 'superadmin' && (
        <Space size="middle">
          <EditTwoTone
            id={record.id}
            onClick={() => {
              handleEdit(record.id)
            }}
          />

          <DeleteTwoTone
            onClick={(e) => {
              e.stopPropagation()
              setId(record.id)
              setIsModalType((preState) => ({
                ...preState,
                delete: true,
              }))
            }}
          />
        </Space>
      )),
    },
  ]

  useEffect(() => {
    fetchData()
  }, [itemCount])
  useEffect(() => {
    if (!isModalType.add && !isModalType.delete && !isModalType.edit) {
      return
    }
    showModal(isModalType)
  }, [isModalType])
  const { Option } = Select
  return (
    <Layout>
      <Layout.Main>
        <h1>メンバ一覧</h1>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="flex w-full items-center justify-between">
            <div>
              <span className="hidden md:inline pr-2">表示件数 </span>
              <Select
                className="no-border"
                size="large"
                value={itemCount}
                onChange={handleSelect}
              >
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div className="flex justify-end">
              <div>
                <div className="text-2xl flex items-center">
                  <Input
                    size="large"
                    className="no-border"
                    placeholder="メンバ名"
                    onChange={handleInput}
                    bordered
                    prefix={<SearchOutlined />}
                  />
                </div>
              </div>
              <div>
                {role === 'superadmin' ? (
                  <Button
                    size="large"
                    type="primary"
                    className="ml-3 no-border"
                    htmlType="button"
                    enabled
                    onClick={handleClick}
                  >
                    メンバー招待
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <Table
            className="w-full rounded-3xl table-styled mt-5 table-striped-rows"
            columns={columns}
            dataSource={filterData}
            rowKey={(record) => record.id}
            onChange={handleChange}
            loading={dataLoading}
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
      </Layout.Main>
    </Layout>
  )
}

MemberList.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default MemberList
