import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Select, Button, Form, Input, Tag, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import './style.scss'
import dynamic from 'next/dynamic'

import {
  EditOutlined,
} from '@ant-design/icons'
import { getUser, taskData } from '../../api/task-detail'

const BoxComment = ({ id }) => {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(true)
  const [form] = Form.useForm()
  const [listUser, setListUser] = useState([])
  const [assign, setAssign] = useState(true)

  const MDEditor = dynamic(
    () => import('~/components/box-comment/editor'),
    { ssr: false },
  )
  // Modal

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
        // const listmember = []
        // console.log(response).da
        // response.data.users.forEach((element) => {
        //   listmember.push(element.name)
        // })
        form.setFieldsValue({
          // assignee: listmember,
          status: response.data.status,
        })
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
        // style={{ marginRight: '3px', paddingTop: '5px', paddingBottom: '3px' }}
        style={{ padding: '7px' }}
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
            <div className="pos flex items-center justify-between">
              <div className="pos-left">
                <Form.Item
                  label=""
                  className="block mx-7"
                  style={{ display: 'block' }}
                  name="detail"
                >
                  <div>
                    <MDEditor />
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
