/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useCallback } from 'react'
import { Select, Input, Table, Empty, Button, Tooltip, Space, notification, Modal } from 'antd'
import { DeleteTwoTone, EditTwoTone, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Layout from '../../layouts/OtherLayout'
import { webInit } from '~/api/web-init'
import { ListScheduleApi } from '~/api/schedule'
import { deleteSchedule } from '~/api/schedule-detail'

function ScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [filterSchedules, setFilterSchedules] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  const [id, setId] = useState()
  const [role, setRole] = useState()
  const router = useRouter()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalType, setIsModalType] = useState({
    delete: false,
    edit: false,
  })

  const columns = [
    {
      title: 'スケジュール',
      dataIndex: 'name',
      key: 'スケジュール',
      width: `${role === 'superadmin' ? '80%' : '100%'}`,
      render: (name, record) => (
        <Tooltip title={name}>
          <a href={`/schedule/${record.id}`}>{name}</a>
        </Tooltip>
      ),
    },
    {
      title: 'アクション',
      key: 'action',
      width: `${role === 'superadmin' ? '20%' : '0%'}`,
      render: (_text, record) =>
        role === 'superadmin' && (
          <Space size="middle">
            <EditTwoTone
              id={record.id}
              onClick={() => {
                setId(record.id)
                setIsModalType((preState) => ({
                  ...preState,
                  edit: true,
                }))
              }}
            />

            <DeleteTwoTone
              onClick={() => {
                setId(record.id)
                setIsModalType((preState) => ({
                  ...preState,
                  delete: true,
                }))
              }}
            />
          </Space>
        ),
    },
  ]

  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem('pagination', JSON.stringify({ ...pagination, pageSize: value }))
  }

  const handleChange = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: e.current,
    }))
  }

  const handleInput = (e) => {
    const result = schedules.filter(
      (obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    )
    setFilterSchedules(result)
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
      if (res.data.auth != null) {
        setRole(res.data.auth.user.role)
      }
    })
    ListScheduleApi.getListSchedule()
      .then((res) => {
        const { data } = res
        setSchedules(data)
        setFilterSchedules(data)
      })
      .finally(() => {
        setDataLoading(false)
      })
  })

  const handleOk = async () => {
    setIsModalVisible(false)
    try {
      if (isModalType.delete) {
        await deleteSchedule(id)
          .then(() => {
            notification.success({
              message: '成功',
              description: '正常に削除されました',
            })
            setId(null)
            fetchData()
            setPagination((preState) => ({
              ...preState,
              current: 1,
            }))
          })
          .catch(() => {
            notification.error({
              message: '失敗',
              description: '削除に失敗しました',
            })
          })
        setIsModalType((preState) => ({ ...preState, delete: false }))
      }

      if (isModalType.edit) {
        setIsModalType((preState) => ({ ...preState, edit: false }))
        window.location.href = `/jf-schedule/${id}/edit`
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsModalType({ delete: false, add: false, edit: false })
  }
  const showModal = (type) => {
    setIsModalVisible(true)
    let title
    if (type.edit) {
      title = 'JFスケジュール一を編集しますか?'
    } else {
      title = 'JFスケジュール一を削除しますか?'
    }
    Modal.confirm({
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

  // fix No. bug
  const Schedules = []
  for (let i = 0; i < filterSchedules.length; i += 1) {
    Schedules.push({
      key: i + 1,
      id: filterSchedules[i].id,
      name: filterSchedules[i].name,
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push('/jf-schedule/add')
  }

  const handleRow = () => ({
    onClick: () => {},
  })

  useEffect(() => {
    fetchData()
  }, [itemCount])

  useEffect(() => {
    if (!isModalType.delete && !isModalType.edit) {
      return
    }
    showModal(isModalType)
  }, [isModalType])

  const { Option } = Select

  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full bg-white-background">
          <div className="flex w-full justify-between">
            <h1 className="ml-0">JFスケジュール一覧</h1>
          </div>
          <div className="flex w-full justify-between">
            <div>
              <span className="text-xl">表示件数 </span>
              <Select className="ml-5" value={itemCount} onChange={handleSelect}>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div className="flex">
              <div className="text-2xl mr-5 flex items-center">
                <Input
                  placeholder="スケジュール"
                  onChange={handleInput}
                  bordered
                  prefix={<SearchOutlined />}
                />
              </div>
              <div>
                {role === 'superadmin' ? (
                  <Button
                    type="primary"
                    className="px-12"
                    htmlType="button"
                    enabled
                    onClick={handleClick}
                    style={{ letterSpacing: '-0.1em' }}
                  >
                    追加
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <Table
            className="rounded-3xl my-5"
            columns={columns}
            dataSource={Schedules}
            rowKey={(record) => record.id}
            onRow={handleRow}
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

ScheduleList.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default ScheduleList
