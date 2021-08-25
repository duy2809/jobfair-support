import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import './style.scss'
import { Form, DatePicker, Input, Select, Button, Modal, Table, Empty, Tooltip } from 'antd'
import { FolderFilled, FileFilled } from '@ant-design/icons'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { getMember, searchFile } from '../../../api/file'

export default function Search() {
  const router = useRouter()
  const JFid = router.query.JFid
  const formatter = buildFormatter(frenchStrings)
  const [form] = Form.useForm()
  const { Option } = Select
  const [data, setData] = useState([])
  const [member, setMember] = useState([])
  const columns = [
    {
      width: '5%',
    },
    {
      title: <div>名前</div>,
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div
          onClick={() => {
            if (record.is_file) {
              window.open(record.link)
            } else {
              // TODO fetch new folder API
            }
          }}
          className="cursor-pointer flex flex-row items-center"
        >
          {(record.is_file) ? <FileFilled className="mr-3" /> : <FolderFilled className="mr-3" />}
          {name.length > 20
            ? (
              <Tooltip placement="top" title={name}>
                <span
                  className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                  style={{ maxWidth: '20ch' }}
                >
                  {name}
                </span>
              </Tooltip>
            ) : (
              <span
                className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                style={{ maxWidth: '20ch' }}
              >
                {name}
              </span>
            )}
        </div>
      ),
    },
    {
      title: '更新者',
      dataIndex: 'updater',
      key: 'updater',
    },
    {
      title: '更新時間',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updatedAt) => (
        <>
          <TimeAgo date={updatedAt} formatter={formatter} />
        </>
      ),
    },
    {
      title: 'ディレクトリ',
      dataIndex: 'path',
      key: 'path',
      width: '35%',
      render: (path) => (
        <Tooltip placement="top" title={path}>
          <span
            className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
            style={{ maxWidth: '20ch' }}
          >
            {path}
          </span>
        </Tooltip>
      ),
    },
  ]
  const [isModalVisible, setIsModalVisible] = useState(false)
  // my code
  const onFinishSuccess = async () => {
    let argument = {
      jfID: JFid,
    }
    const nameInput = form.getFieldValue('name')
    const startDateInput = form.getFieldValue('start_date')
    const endDateInput = form.getFieldValue('end_date')
    const updaterIdInput = form.getFieldValue('updater')
    if (nameInput) {
      argument = {
        ...argument, name: nameInput,
      }
    }
    if (startDateInput) {
      argument = {
        ...argument, start_date: startDateInput.format('YYYY-MM-DD'),
      }
    }
    if (endDateInput) {
      argument = {
        ...argument, end_date: endDateInput.format('YYYY-MM-DD'),
      }
    }
    if (updaterIdInput) {
      argument = {
        ...argument, updaterId: updaterIdInput,
      }
    }
    const res = await searchFile({
      params: argument,
    })
    if (res.data) {
      const result = res.data.map((element) => ({
        key: element.id,
        checkbox: false,
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
        path: element.path,
      }))
      setData(result)
    }
    setIsModalVisible(true)
  }
  const onFinishFailed = () => {
    console.log(1)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  useEffect(async () => {
    const res = await getMember(JFid)
    setMember(res.data)
  }, [])
  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        onFinish={onFinishSuccess}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="名前" name="name">
          <Input className="h-8" />
        </Form.Item>
        <Form.Item label="更新日" name="start_date">
          <DatePicker />
        </Form.Item>
        <Form.Item label=" " name="end_date" colon={false}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="更新者" name="updater">
          <Select
            className="FileSelectBox"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {member.map((element) => (
              <Option value={element.id}>{element.name}</Option>
            ))}
          </Select>

        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button
            type="primary"
            htmlType="submit"
            // className="w-28"
            className="FileButton"
          >
            検索
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="ファイルを検索"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        className="FileModal"
      >
        <Table
          scroll={{ y: 350 }}
          columns={columns}
          dataSource={data}
          pagination={false}
          // onRow={onRowClick}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="満足しているファイルはありません。" /> }}
        />
        <Button
          type="primary"
          className="w-28 mt-5"
          onClick={() => {
            setIsModalVisible(false)
          }}
        >
          閉じる
        </Button>
      </Modal>
    </>

  )
}
