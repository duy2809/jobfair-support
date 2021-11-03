import { EditOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { Button, Divider, Form, Input, Select, Tag, Tooltip, Typography, notification } from 'antd'
// import CommentChannel from '../../libs/echo/channels/comment'
import React, { useContext, useEffect, useState } from 'react'
import { ReactReduxContext, useSelector } from 'react-redux'
import { addComment, getComments, updateComment } from '../../api/comment'
import { getUser, taskData } from '../../api/task-detail'
import Editor from '../box-comment/editor'
import { commentSelectors } from '../../store/modules/comment'
import actions from '../../store/modules/comment/types'
import { editTask } from '../../api/edit-task'
import Comment from './Comment'

import dynamic from 'next/dynamic'

// const CKeditor = dynamic(
//   // eslint-disable-next-line import/no-unresolved
//   () => import('~/components/comment/CKeditor'),
//   // eslint-disable-next-line comma-dangle
//   { ssr: false }
// )

function index({ id, statusProp, assigneeProp, taskInfo }) {
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(false)
  const [show, setShow] = useState(true)
  const [form] = Form.useForm()
  const [listUser, setListUser] = useState([])
  const [assign, setAssign] = useState(true)
  const [value, setValue] = useState('')
  const [editingComment, setEditingComment] = useState({})
  const { store } = useContext(ReactReduxContext)

  const INIT_COMMENTS_NUM = 5
  const MORE_COMMENTS_NUM = 10

  const commentArray = useSelector((state) => commentSelectors.comments(state).toJS())

  const getMoreComments = async (start, count) => {
    try {
      const response = await getComments(id, start, count)
      if (response.status === 200) {
        store.dispatch({
          type: actions.LOAD_COMMENT,
          payload: {
            params: [id, start, count],
            commentArray,
          },
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Modal
  const showBox = () => {
    setVisible(true)
    setShow(false)
  }

  const closeBox = () => {
    clearForm()
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
    await taskData(id).then((response) => {
      form.setFieldsValue({
        // assignee: listUser,
        status: response.data.status,
      })
    })
  }
  const clearForm = () => {
    form.resetFields()
    setEditing(false)
    setValue('')
  }
  useEffect(() => {
    // new CommentChannel()
    //   .onOutput((data) => {
    //     console.log('log' + data)
    //   })
    //   .listen()

    fetchListMember()
    fetchTaskData()
    getMoreComments(0, INIT_COMMENTS_NUM)
    return () => {
      store.dispatch({ type: actions.CLEAR_STORE, payload: [] })
    }
  }, [])

  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']

  const tagRender = (props) => {
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

  const onFormSummit = async () => {
    try {
      const { status, assignee } = form.getFieldsValue()
      // console.log(form.getFieldsValue())
      // console.log(assignee)
      // TODO: change task description
      const comment = {
        task_id: id,
        body: value ?? '',
        assignee: JSON.stringify(assignee),
        status,
      }

      const response = await addComment(comment)
      const newComment = response.data
      console.log(newComment)
      // window.scrollTo({ top: '0', left: '0', behavior: 'smooth' })
      if (newComment) {
        store.dispatch({
          type: actions.ADD_COMMENT,
          payload: [...commentArray, newComment],
        })
        form.resetFields()
        setValue('')
      }
      return newComment
    } catch (error) {
      return error
    }
  }

  const typing = (e) => {
    setValue(e.target.value)
  }

  const callBack = (childState) => {
    showBox()
    setEditingComment(childState)
    setEditing(true)
    form.resetFields()
    setValue(childState.content)

    form.setFieldsValue({
      detail: childState.content,
      assignee: assigneeProp,
      status: statusProp,
    })
  }

  const onDoneEditing = async (e) => {
    e.preventDefault()
    const { status, assignee } = form.getFieldsValue()
    const newComment = { ...editingComment, content: value, status, assignee }

    const response = await updateComment(newComment.id, newComment)
    if (response.status === 200) {
      const newComments = commentArray.map((comment) => {
        if (comment.id === newComment.id) {
          return newComment
        }
        return comment
      })
      store.dispatch({
        type: actions.EDIT_COMMENT,
        payload: newComments,
      })
    }
    setEditing(false)
    form.resetFields()
    const data = Object.assign(taskInfo, {
      status,
      admin: assignee,
    })
    const isEdited = await editTask(id, data)
    if (isEdited.status === 200) {
      notification.open({
        icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
        duration: 3,
        message: '更新しました!',
        onClick: () => {},
      })
    }
  }

  return (
    <div className="my-10 px-10">
      <span className="comment__count block">{`コメント(${commentArray.length})`}</span>
      <Typography.Link
        className="see-more block text-center"
        onClick={() => getMoreComments(commentArray.length, MORE_COMMENTS_NUM)}
      >
        もっと読む
      </Typography.Link>
      <Divider className="mx-2 bg-gray-300" />
      {/* list comments history  */}
      <div className="comment-history">
        {commentArray.map((comment) => (
          <Comment key={comment.id} comment={comment} parentCallBack={callBack} />
        ))}
      </div>

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
            <Form form={form} layout="vertical" onFinish={onFormSummit}>
              <div className="pos flex items-center justify-between">
                <div className="pos-left">
                  <Form.Item
                    label=""
                    className="block mx-7"
                    style={{ display: 'block' }}
                    name="detail"
                    onChange={typing}
                  >
                    <Editor value={value} />
                    {/* <CKeditor /> */}
                  </Form.Item>
                </div>
                <div className="pos-right">
                  <Form.Item label={<p className="font-bold">ステータス</p>} name="status">
                    <Select size="large" className="addJF-selector" placeholder="ステータス">
                      {listStatus.map((element) => (
                        <Select.Option disabled={editing} value={element}>
                          {element}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<p className="font-bold">担当者</p>}
                    name="assignee"
                    className="multiples"
                  >
                    {assign ? (
                      <Select mode="multiple" showArrow tagRender={tagRender}>
                        {listUser.map((element) => (
                          <Select.Option
                            className="validate-user"
                            key={element.id}
                            disabled={editing}
                            value={element.id}
                          >
                            {element.name}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        mode="multiple"
                        showArrow
                        disabled={editing}
                        tagRender={tagRender}
                        style={{ width: '100%', border: '1px solid red', borderRadius: 6 }}
                        className="multiples"
                      >
                        {listUser.map((element) => (
                          <Select.Option
                            className="validate-user"
                            key={element.id}
                            disabled={editing}
                            value={element.id}
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
                    {/* ============================== */}
                    <Button htmlType="button" type="primary" className="button_preview mx-3">
                      プレビュー
                    </Button>
                    {/* =============================== */}
                    {editing ? (
                      <Button
                        type="primary"
                        className="edit_brn"
                        style={{ letterSpacing: '-1px' }}
                        onClick={onDoneEditing}
                      >
                        <span>編集</span>
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="button_save"
                        style={{ letterSpacing: '-1px' }}
                      >
                        <span>追加</span>
                      </Button>
                    )}
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>
        ) : null}
      </div>
    </div>
  )
}

index.propTypes = {}

export default index
