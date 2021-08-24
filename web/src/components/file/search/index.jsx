import React, { useState } from 'react'
import './style.scss'
import { Form, DatePicker, Input, Select, Button, Modal, Table, Empty, Tooltip } from 'antd'
import { FolderFilled, FileFilled } from '@ant-design/icons'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

export default function Search() {
  const formatter = buildFormatter(frenchStrings)
  const [form] = Form.useForm()
  const { Option } = Select
  const [data, setData] = useState([
    {
      key: '0',
      checkbox: true,
      name: '1abc.jpgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      is_file: false,
      updater: 'vu phong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '1',
      checkbox: false,
      is_file: false,
      name: '0abdsfac',
      updater: 'vu phong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '2',
      checkbox: false,
      is_file: true,
      name: 'fdsfasabc.jpg',
      updater: 'vu phongdsf',
      updated_at: '2021-08-20 10:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',
    },
    {
      key: '3',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',
    },
    {
      key: '4',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',
    },
    {
      key: '5',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '6',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '7',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '8',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '9',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
  ])
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
    },
  ]
  const [isModalVisible, setIsModalVisible] = useState(false)
  // my code
  const onFinishSuccess = () => {
    setIsModalVisible(true)
  }
  const onFinishFailed = () => {
    console.log(1)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // const onRowClick = (record) => ({
  //   onClick: () => {
  //     window.open(record.link)
  //   }, // click row

  // })
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
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
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
          onClick={() => { setIsModalVisible(false) }}
        >
          閉じる
        </Button>
      </Modal>
    </>

  )
}
