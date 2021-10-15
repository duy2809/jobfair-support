import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Select, Button, Form, Input, Tag, Tooltip, Modal } from 'antd'
import PropTypes from 'prop-types'
import './style.scss'
// eslint-disable-next-line import/no-unresolved
import '@uiw/react-md-editor/markdown-editor.css'
// eslint-disable-next-line import/no-unresolved
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import {
  EditOutlined,
  // LinkOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { getUser, taskData } from '../../api/task-detail'

const BoxComment = ({ id }) => {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(true)
  const [showLink, setShowLink] = useState(false)
  const [form] = Form.useForm()
  const [listUser, setListUser] = useState([])
  const [assign, setAssign] = useState(true)
  const [value, setValue] = useState('')

  const MDEditor = dynamic(
    // eslint-disable-next-line import/no-unresolved
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false },
  )
  // Modal
  const [isModalVisible, setIsModalVisible] = useState(false)

  // const showModal = () => {
  //   setIsModalVisible(true)
  // }
  // const title = {
  //   name: 'title3',
  //   keyCommand: 'title3',
  //   buttonProps: { label: 'Insert title3', class: 'button_link' },
  //   icon: <LinkOutlined />,
  //   execute: () => {
  //     showModal()
  //   },
  // }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showBox = () => {
    setVisible(true)
    setShow(false)
  }

  const closeBox = () => {
    setVisible(false)
    setShow(true)
  }

  const fetchListMember = async () => {
    await getUser()
      .then((response) => {
        setListUser(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const fetchTaskData = async () => {
    await taskData(id)
      .then((response) => {
        const listmember = []
        response.data.users.forEach((element) => {
          listmember.push(element.name)
        })
        form.setFieldsValue({
          assignee: listmember,
          status: response.data.status,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchListMember()
    fetchTaskData()
  }, [])

  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']

  const tagRenderr = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const nameUser = form.getFieldValue('assignee')
    if (nameUser.length !== 0) {
      setAssign(true)
    }
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={() => {
          onClose()
          const nameUsers = form.getFieldValue('assignee')
          if (nameUsers.length === 0) {
            setAssign(false)
          }
          if (nameUsers.length !== 0) {
            setAssign(true)
          }
        }}
        style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
      >
        <Tooltip title={label}>
          <span className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden">
            {label}
          </span>
        </Tooltip>
      </Tag>
    )
  }

  return (
    <div className="mt-5 box-comment">
      {show ? (
        <div className="flex">
          <Input
            style={{ width: '89%' }}
            onClick={showBox}
            placeholder="コメントを入力してください"
          />
          <div className="btn" onClick={showBox} style={{ cursor: 'pointer' }}>
            <EditOutlined className="ml-6" />
            <span>ステータス変更</span>
          </div>
        </div>
      ) : null}
      {visible ? (
        <div className="box">
          <Form form={form} layout="vertical">
            <div className="pos flex items-center">
              <div className="pos-left">
                <Form.Item
                  label=""
                  className="block mx-7"
                  style={{ display: 'block' }}
                  name="detail"
                >
                  <div>
                    <MDEditor
                      style={{ height: '40px !important' }}
                      preview="edit"
                      height="200"
                      value={value}
                      onChange={setValue}
                      // commands={[title]}
                    />
                    <Modal
                      title="ファイル追加"
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText="保存"
                      cancelText="キャンセル"
                    >
                      <div className="flex items-center justify-between">
                        <div className="ml-4">
                          <Input
                            size="large"
                            style={{ width: '155%' }}
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                          />
                        </div>
                        <div className="">
                          <PlusCircleOutlined
                            style={{ fontSize: '25px', cursor: 'pointer' }}
                            onClick={() => {
                              setShowLink(!showLink)
                            }}
                          />
                        </div>
                      </div>
                      {showLink ? (
                        <div className="mt-6">
                          <Form
                            layout="horizontal"
                            colon={false}
                            labelAlign="right"
                            className="mr-14"
                            labelCol={{
                              span: 5,
                            }}
                          >
                            <Form.Item label={<p className="font-bold text-right">テキスト</p>}>
                              <Input size="large" placeholder="Add text" />
                            </Form.Item>
                            <Form.Item label={<p className="font-bold text-right">リンク</p>}>
                              <Input size="large" placeholder="Add text" />
                            </Form.Item>
                          </Form>
                        </div>
                      ) : null}
                    </Modal>
                  </div>
                </Form.Item>
              </div>
              <div className="pos-right">
                <Form.Item label={<p className="font-bold">ステータス</p>} name="status">
                  <Select size="large" className="addJF-selector" placeholder="ステータス">
                    {listStatus.map((element) => (
                      <Select.Option value={element}>{element}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={<p className="font-bold">担当者</p>}
                  name="assignee"
                  className="multiples"
                >
                  {assign ? (
                    <Select mode="multiple" showArrow tagRender={tagRenderr}>
                      {listUser.map((element) => (
                        <Select.Option
                          className="validate-user"
                          key={element.id}
                          value={element.name}
                        >
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRenderr}
                      style={{ width: '100%', border: '1px solid red', borderRadius: 6 }}
                      className="multiples"
                    >
                      {listUser.map((element) => (
                        <Select.Option
                          className="validate-user"
                          key={element.id}
                          value={element.name}
                        >
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="flex items-center justify-center ">
              <Form.Item label=" " className=" ">
                <div className="flex">
                  <Button
                    htmlType="button"
                    type="primary"
                    className="button_cancel"
                    onClick={closeBox}
                  >
                    キャンセル
                  </Button>
                  <Button htmlType="button" type="primary" className="button_preview mx-3">
                    プレビュー
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button_save"
                    style={{ letterSpacing: '-1px' }}
                  >
                    <span>追加</span>
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default BoxComment

BoxComment.propTypes = {
  id: PropTypes.object.isRequired,
}
