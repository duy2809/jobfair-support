import { CheckCircleTwoTone, EditOutlined, ExclamationCircleTwoTone } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, notification, Select, Tag, Tooltip } from 'antd'
// import CommentChannel from '../../libs/echo/channels/comment'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import { ReactReduxContext, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { addComment, getComments, updateComment } from '../../api/comment'
import { taskData, getUserByCategory } from '../../api/task-detail'
import { commentSelectors } from '../../store/modules/comment'
import actions from '../../store/modules/comment/types'
import MarkDownView from '../markDownView'
import Comment from './Comment'
import MyEditor from './Editor'
import './styles.scss'

function index({
  id,
  statusProp,
  assigneeProp,
  category,
  parentCallback1,
  parentCallback2,
  roleTask,
  jfInfo,
}) {
  const [visible, setVisible] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [show, setShow] = useState(true)
  const [form] = Form.useForm()
  const [listUser, setListUser] = useState([])
  const [assign, setAssign] = useState(true)
  const [value, setValue] = useState('')
  const [editingComment, setEditingComment] = useState({})
  const { store } = useContext(ReactReduxContext)
  const router = useRouter()
  const idUser = store.getState().get('auth').get('user').get('id')
  const INIT_COMMENTS_NUM = 5
  const MORE_COMMENTS_NUM = 10

  const commentArray = useSelector((state) => commentSelectors.comments(state).toJS())

  const getMoreComments = async (start, count) => {
    try {
      const response = await getComments(id, start, count)
      if (response.status === 200) {
        if (response.data.length > 0) {
          store.dispatch({
            type: actions.LOAD_COMMENT,
            payload: {
              params: [id, start, count],
              commentArray,
            },
          })
        }
      }
      return commentArray
    } catch (error) {
      return error
    }
  }
  const clearForm = () => {
    form.resetFields()
    setEditing(false)
    setValue('')
  }
  // Modal
  const showBox = () => {
    clearForm()
    setVisible(true)
    setShow(false)
  }

  const closeBox = () => {
    clearForm()
    setVisible(false)
    setShow(true)
  }
  const openPreview = () => {
    setPreviewing(true)
  }
  const pushData2Parent1 = useCallback((data) => {
    parentCallback1(data)
  }, [])
  const pushData2Parent2 = useCallback((data) => {
    parentCallback2(data)
  }, [])
  const fetchListMember = async () => {
    try {
      let listMember = []
      // eslint-disable-next-line no-plusplus
      for (let item = 0; item < category.length; item++) {
        // eslint-disable-next-line no-await-in-loop
        await getUserByCategory(category[item])
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            listMember = listMember.concat(response.data)
          })
          .catch((error) => {
            if (error.response.status === 404) {
              router.push('/404')
            }
          })
      }
      setListUser(listMember)
    } catch (err) {
      if (err.response.status === 404) {
        router.push('/404')
      }
    }
  }

  const fetchTaskData = async () => {
    await taskData(id)
      .then((response) => {
        form.setFieldsValue({
          status: response.data.status,
        })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const [listStatus, setListStatus] = useState([])
  useEffect(() => {
    if (roleTask === 'jfadmin') {
      setListStatus(['未着手', '進行中', '完了', '中断', '未完了'])
    } else if (roleTask === 'reviewer') {
      setListStatus(['進行中', 'リビュエー待ち', '完了', '中断', '未完了'])
    } else {
      setListStatus(['未着手', '進行中', 'リビュエー待ち'])
    }
    fetchListMember()
    fetchTaskData()
    getMoreComments(0, INIT_COMMENTS_NUM)
    return () => {
      store.dispatch({ type: actions.CLEAR_STORE, payload: [] })
    }
  }, [category, roleTask])
  const tagRender = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const nameUser = form.getFieldValue('assignee')
    if (nameUser?.length !== 0) {
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
      const { memberStatus, status, assignee } = form.getFieldsValue()

      // TODO: change task description
      const comment = {
        task_id: id,
        body: value.replace(/\\s/g, ' ').trim() ?? '',
        assignee: JSON.stringify(assignee),
        status,
        memberStatus,
      }
      if (
        !(comment.body || comment.assignee || comment.status || comment.memberStatus)
        || !(comment.body !== '<p></p>' || comment.assignee || comment.status || comment.memberStatus)
      ) {
        return notification.open({
          icon: <ExclamationCircleTwoTone twoToneColor="red" />,
          duration: 3,
          message: '更新しました!',
          onClick: () => {},
        })
      }
      const response = await addComment(comment)
      const newComment = response.data
      console.log(newComment)
      if (response.status === 200) {
        if (newComment) {
          if (newComment.new_assignees.length !== 0 || newComment.new_status) {
            pushData2Parent1({
              new_assignees: newComment.new_assignees ?? '',
              new_status: newComment.new_status ?? '',
              action: 'changeTaskStatus',
            })
          } else if (newComment.new_member_status) {
            pushData2Parent2({
              new_member_status: newComment.new_member_status,
              action: 'changeMemberStatus',
            })
          }
          store.dispatch({
            type: actions.ADD_COMMENT,
            payload: [...commentArray, newComment],
          })
          form.resetFields()
          setValue('')
          return notification.open({
            icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
            duration: 3,
            message: '正常に登録されました。',
            onClick: () => {},
          })
        }
      }
      return newComment
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      } else return error
      return null
    }
  }

  const typing = (data) => {
    setValue(data)
  }

  const callBack = (childState) => {
    const copyState = {}
    Object.assign(copyState, childState)
    showBox()
    setEditingComment(copyState.comment)
    setEditing(true)
    form.resetFields()
    const commentContent = copyState.comment.content
    setValue(commentContent)

    form.setFieldsValue({
      detail: commentContent,
      assignee: assigneeProp,
      status: statusProp,
    })
  }

  const onDoneEditing = async (e) => {
    e.preventDefault()

    const { status, assignee } = form.getFieldsValue()
    const newComment = { ...editingComment, content: value, status, assignee }
    try {
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
        notification.open({
          icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
          duration: 3,
          message: '更新しました!',
          onClick: () => {},
        })
        setEditing(false)
        form.resetFields()
        return newComments
      }
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
    return newComment
  }

  return (
    <div className="comment my-10 px-10 ">
      <span className="comment__count block">{`コメント数(${commentArray.length})`}</span>
      <div className="flex justify-center items-center ">
        <Button onClick={() => getMoreComments(commentArray.length, MORE_COMMENTS_NUM)}>
          コメントをもっと見る
        </Button>
      </div>
      <Divider className="mx-2 bg-gray-300" />
      {/* list comments history  */}
      <div className="comment-history">
        {commentArray.map((comment) => (
          <Comment key={comment.id} comment={comment} parentCallBack={callBack} />
        ))}
      </div>

      <div className="mt-5 box-comment">
        {show && (
          <div className="flex justify-between items-center">
            <Input className="w-3/4" onClick={showBox} placeholder="コメントを入力してください" />
            <div className="btn w-1/4 text-center" onClick={showBox} style={{ cursor: 'pointer' }}>
              <EditOutlined className="ml-3 " />
              <span>ステータス変更</span>
            </div>
          </div>
        )}
        {visible && (
          <div className="box ">
            <Modal
              title="プレビュー"
              centered
              visible={previewing}
              onOk={() => {
                setPreviewing(false)
              }}
              onCancel={() => {
                setPreviewing(false)
              }}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => {
                    setPreviewing(false)
                  }}
                >
                  OK
                </Button>,
              ]}
              // onCancel={() => {}}
            >
              <MarkDownView source={value.replace(/\\s/g, '')} />
            </Modal>
            <Form form={form} layout="vertical" onFinish={onFormSummit}>
              <div className="pos flex items-start justify-evenly ">
                <div className="pos-left w-8/12 mr-5">
                  <Form.Item
                    label=""
                    className="block mx-7"
                    style={{ display: 'block' }}
                    name="detail"
                    // onChange={typing}
                  >
                    {/* <Editor value={value} /> */}
                    {/* <CKeditor /> */}
                    <MyEditor jfID={id} jfInfo={jfInfo} value={value} onChange={typing} />
                  </Form.Item>
                </div>
                <div className="pos-right w-4/12 ">
                  {/* selector */}
                  <div className="h-full xl:mb-1">
                    {roleTask === `taskMember${idUser}` ? (
                      <Form.Item
                        label={<p className="font-bold">ステータス</p>}
                        name="memberStatus"
                      >
                        <Select
                          size="large"
                          defaultValue=""
                          className="addJF-selector"
                          placeholder="memberステータス"
                        >
                          {listStatus.map((element) => (
                            <Select.Option disabled={editing} value={element}>
                              {element}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : (
                      <Form.Item label={<p className="font-bold">ステータス</p>} name="status">
                        <Select
                          size="large"
                          defaultValue=""
                          className="addJF-selector"
                          placeholder="ステータス"
                        >
                          {listStatus.map((element) => (
                            <Select.Option disabled={editing} value={element}>
                              {element}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                    <Form.Item
                      label={<p className="font-bold">担当者</p>}
                      name="assignee"
                      className="multiples"
                    >
                      {assign ? (
                        <Select
                          mode="multiple"
                          showArrow
                          tagRender={tagRender}
                          disabled={roleTask !== 'jfadmin'}
                        >
                          {listUser.map((element) => (
                            <Select.Option
                              className="validate-user"
                              key={element.id}
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
                          tagRender={tagRender}
                          style={{
                            width: '100%',
                            border: '1px solid red',
                            borderRadius: 6,
                          }}
                          disabled={roleTask !== 'jfadmin'}
                          className="multiples"
                        >
                          {listUser.map((element) => (
                            <Select.Option
                              className="validate-user"
                              key={element.id}
                              value={element.id}
                            >
                              {element.name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </div>
                  {/* buttons */}
                  <div className="xl:mt-20">
                    <Form.Item noStyle>
                      <div className="grid xl:gap-5 md:gap-2 gap-2 xl:grid-cols-3 lg:grid-cols-1 overflow-hidden grid-flow-row ">
                        <Button
                          htmlType="button"
                          className="button_cancel ant-btn "
                          onClick={closeBox}
                        >
                          キャンセル
                        </Button>
                        {/* ============================== */}
                        <Button
                          htmlType="button"
                          type="primary"
                          onClick={openPreview}
                          className="button_preview "
                        >
                          プレビュー
                        </Button>
                        {/* =============================== */}
                        {editing ? (
                          <Button
                            type="primary"
                            className="edit_brn "
                            style={{ letterSpacing: '-1px' }}
                            onClick={onDoneEditing}
                          >
                            <span>編集</span>
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="button_save "
                            style={{ letterSpacing: '-1px' }}
                          >
                            <span>追加</span>
                          </Button>
                        )}
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}

index.propTypes = {}

export default memo(index)
