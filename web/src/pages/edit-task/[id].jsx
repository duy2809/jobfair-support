import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Modal, notification, Select, Tag, Tooltip } from 'antd'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { editTask, listReviewersSelectTag, reviewers } from '../../api/edit-task'
import { jftask } from '../../api/jf-toppage'
import { afterTask, beforeTask, getUserByCategory, taskData } from '../../api/task-detail'
import { webInit } from '../../api/web-init'
import Editor from '../../components/comment/Editor'
import Loading from '../../components/loading'
import JfLayout from '../../layouts/layout-task'
import * as Extensions from '../../utils/extensions'
import './style.scss'

function EditTask() {
  const dateFormat = 'YYYY/MM/DD'
  const router = useRouter()
  const idTask = router.query.id
  const [form] = Form.useForm()
  const [disableBtn, setdisableBtn] = useState(false)
  const [assign, setAssign] = useState(true)
  const [beforeTasksNew, setBeforeTaskNew] = useState([])
  const [listUser, setListUser] = useState([])
  const [allTask, setAllTask] = useState([])
  const [afterTasksNew, setafterTaskNew] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [reviewersSelected, setReviewersSelected] = useState([])
  const [users, setUsers] = useState({
    id: null,
    name: '',
    role: '',
  })
  const [jfID, setJfID] = useState('')
  const [infoTask, setInfoTask] = useState({
    name: '',
    categories: '',
    milestone: '',
    status: '',
    start_time: '',
    end_time: '',
    effort: '',
    is_day: null,
    unit: '',
    description_of_detail: '',
  })
  const [reRender, setReRender] = useState(false)
  const [loading, setLoading] = useState(true)
  const [idJF, setIdJF] = useState(null)
  const [reviewersData, setReviewersData] = useState([])
  const [reviewersSelectTag, setReviewersSelectTag] = useState([])
  const [countUserAs, setCountUserAs] = useState(null)
  const [description, setDescription] = useState(undefined)
  const fetchTaskData = async () => {
    await reviewers(idTask)
      .then((response) => {
        if (response.status === 200) {
          setReviewersData(response.data)
          const idReviewer = []
          response.data.forEach((element) => {
            idReviewer.push(element.id)
          })
          setReviewersSelected(idReviewer)
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          router.push('/404')
        }
      })

    await listReviewersSelectTag(idTask)
      .then((response) => {
        if (response.status === 200) {
          setReviewersSelectTag(response.data)
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          router.push('/404')
        }
      })

    await taskData(idTask)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data
          const categoryName = []
          response.data.categories.forEach((element) => {
            categoryName.push(element.category_name)
          })
          setInfoTask({
            name: data.name,
            categories: categoryName,
            milestone: data.milestone.name,
            status: data.status,
            start_time: data.start_time,
            end_time: data.end_time,
            effort: data.template_task.effort,
            is_day: data.template_task.is_day,
            unit: data.template_task.unit,
            description_of_detail: data.description_of_detail || '',
          })
          setJfID(response.data.schedule.jobfair.id)
          setIdJF(data.schedule.jobfair.id)
          // eslint-disable-next-line no-use-before-define
          fetchListTask()
          const listmember = []
          data.users.forEach((element) => {
            listmember.push(element.name)
          })
          const listReviewers = []
          reviewersData.forEach((element) => {
            listReviewers.push(element.name)
          })
          setCountUserAs(listmember)

          form.setFieldsValue({
            name: data.name,
            // category: data.categories[0].category_name,
            milestone: data.milestone.name,
            assignee: listmember,
            status: data.status,
            start_time: moment(data.start_time.split('-').join('/'), dateFormat),
            end_time: moment(data.end_time.split('-').join('/'), dateFormat),
            detail: data.description_of_detail,
            reviewers: listReviewers.length === 0 ? ['??????'] : listReviewers,
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('???????????????????????????'))
    }
    return Promise.resolve()
  }
  const EndDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('???????????????????????????'))
    }
    const startTime = form.getFieldValue('start_time')
    if (value < startTime) {
      return Promise.reject(new Error('??????????????????????????????????????????????????????'))
    }
    return Promise.resolve()
  }
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const tagRender = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, value, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    const id = allTask.find((e) => e.name === value)
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
      >
        <Tooltip title={label}>
          {id ? (
            <a
              target="_blank"
              href={`/task-detail/${id.id}`}
              className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"
              rel="noreferrer"
            >
              {truncate(label)}
            </a>
          ) : (
            <a
              target="_blank"
              className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"
              rel="noreferrer"
            >
              {truncate(label)}
            </a>
          )}
        </Tooltip>
      </Tag>
    )
  }

  const tagRenderr = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const nameUser = form.getFieldValue('assignee')
    setCountUserAs(nameUser)
    if (nameUser.length < 2) {
      form.setFieldsValue({
        reviewers: ['??????'],
      })
    }
    if (nameUser.length !== 0) {
      document.getElementById('error-user').setAttribute('hidden', 'text-red-600')
      setAssign(true)
      form.setFieldsValue({})
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
            setCountUserAs(null)
            document.getElementById('error-user').removeAttribute('hidden', 'text-red-600')
          }
          if (nameUsers.length !== 0) {
            setAssign(true)
            document.getElementById('error-user').setAttribute('hidden', 'text-red-600')
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
  const filtedArr = () => {
    setIsEdit(true)
    const before = form.getFieldsValue().taskBefore
    const after = form.getFieldsValue().afterTask
    let selectedItems = []
    if (before && !after) {
      selectedItems = [...selectedItems, ...before]
    } else if (!before && after) {
      selectedItems = [...selectedItems, ...after]
    } else if (before && after) {
      selectedItems = [...before, ...after]
    }
    const filted = allTask.filter((e) => !selectedItems.includes(e.name))
    setBeforeTaskNew(filted)
    setafterTaskNew(filted)
    return filted
  }
  const TaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('???????????????????????????'))
    }
    // if (value.match(Extensions.Reg.specialCharacter)) {
    //   return Promise.reject(new Error('????????????????????????????????????????????????'))
    // }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('?????????????????????????????????????????????'))
    }

    return Promise.resolve()
  }
  // eslint-disable-next-line consistent-return
  const onValueNameChange = (e) => {
    setIsEdit(true)
    form.setFieldsValue({
      name: e.target.value,
    })
    if (e.target.value) {
      document.getElementById('validate_name').style.border = '1px solid #ffd803'
      return document.getElementById('error-msg').setAttribute('hidden', 'text-red-600')
    }

    document.getElementById('validate_name').style.border = '0.5px solid red'
  }

  const onReviewersChange = (value) => {
    const newReviewers = []
    newReviewers.push(value)
    setReviewersSelected(newReviewers)
  }

  const getDataUser = async () => {
    await webInit().then((response) => {
      setUsers({
        id: response.data.auth.user.id,
        name: response.data.auth.user.name,
        role: response.data.auth.user.role,
      })
    })
  }

  const saveNotification = () => {
    notification.success({
      message: '??????????????????????????????????????????',
      duration: 3,
      onClick: () => {},
    })
  }

  const forbidNotification = () => {
    notification.error({
      message: 'Method not allowed',
    })
  }
  const openNotification = (type, message, descrip) => {
    notification[type]({
      message,
      descrip,
      duration: 2.5,
    })
  }
  const onFinishSuccess = async (values) => {
    let checkName = false
    // eslint-disable-next-line consistent-return
    allTask.forEach((element) => {
      if (values.name !== infoTask.name) {
        if (values.name === element.name) {
          checkName = true
          document.getElementById('validate_name').style.border = '1px solid red'
          return document.getElementById('error-msg').removeAttribute('hidden', 'text-red-600')
        }
      }
    })
    if (!checkName) {
      try {
        const beforeID = []
        const afterIDs = []
        const adminas = []
        if (values.taskBefore && values.afterTask) {
          // eslint-disable-next-line array-callback-return
          allTask.map((e) => {
            if (values.taskBefore.includes(e.name)) {
              beforeID.push(e.id)
            }
            if (values.afterTask.includes(e.name)) {
              afterIDs.push(e.id)
            }
          })
        }
        if (values.assignee) {
          listUser.map((e) => {
            if (values.assignee.includes(e.name)) {
              adminas.push(e.id)
            }
            return ''
          })
        }
        const data = {
          name: values.name,
          description_of_detail: infoTask.description_of_detail.replace(/\\s/g, '').trim(),
          beforeTasks: beforeID,
          afterTasks: afterIDs,
          start_time: values.start_time.format(Extensions.dateFormat),
          end_time: values.end_time.format(Extensions.dateFormat),
          admin: adminas,
          user_id: users.id,
          status: values.status,
          reviewers: values.reviewers[0] === '??????' ? [] : reviewersSelected,
        }
        if (data.description_of_detail === '') {
          data.description_of_detail = ' '
        }

        if (countUserAs.length > 1 && values.reviewers[0] === '??????') {
          openNotification('error', '???????????????????????????????????????????????????????????????????????????????????????')
        } else {
          setdisableBtn(true)
          await editTask(idTask, data)
            .then((response) => {
              router.push(`/task-detail/${idTask}`)
              if (response.data.warning === true) {
                notification.warning({
                  duration: 3,
                  message: response.data.message,
                  onClick: () => {},
                })
              } else saveNotification()
            })
            .catch((error) => {
              setdisableBtn(false)
              if (error.response.status === 404) {
                router.push('/404')
              } else
              if (error.response.status === 400) {
                if (error.response.data?.error) {
                  notification.error({
                    message: '???????????????????????????????????????????????????????????????????????????????????????????????????',
                  })
                } else {
                  forbidNotification()
                }
              } else {
                forbidNotification()
              }
            })
        }
      } catch (error) {
        setdisableBtn(false)
        if (error.response.status === 404) {
          router.push('/404')
        }
        return error
      }
    }
    return ''
  }

  const onFinishFailed = (errorInfo) => errorInfo
  const cancelConfirmModle = () => {
    if (isEdit === false) {
      router.push(`/tasks/${idJF}`)
    } else {
      Modal.confirm({
        title: '???????????????????????????????????????????????????????????????',
        icon: <ExclamationCircleOutlined />,
        content: '',
        centered: true,
        onOk: () => {
          router.push(`/task-detail/${idTask}`)
        },

        onCancel: () => {},
        okText: '??????',
        cancelText: '?????????',
      })
    }
  }
  const fetchBeforeTask = async () => {
    await beforeTask(idTask)
      .then((response) => {
        const listbfTask = []
        response.data.before_tasks.forEach((element) => {
          listbfTask.push(element.name)
        })
        form.setFieldsValue({
          taskBefore: listbfTask,
        })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchafterTask = async () => {
    await afterTask(idTask)
      .then((response) => {
        const listatTask = []
        response.data.after_tasks.forEach((element) => {
          listatTask.push(element.name)
        })
        form.setFieldsValue({
          afterTask: listatTask,
        })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchListTask = async () => {
    if (idJF) {
      await jftask(idJF)
        .then((response) => {
          const notSelectedTask = response.data.schedule.tasks.filter(
            (task) => task.name !== infoTask.name,
          )
          setAllTask(notSelectedTask)
          setBeforeTaskNew(notSelectedTask)
          setafterTaskNew(notSelectedTask)
        })
        .catch((err) => {
          if (err.response.status === 404) {
            router.push('/404')
          }
        })
    }
  }
  const fetchListMember = async () => {
    let listMember = []
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < infoTask.categories.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await getUserByCategory(infoTask.categories[index])
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
  }
  useEffect(() => {
    fetchTaskData()
    fetchBeforeTask()
    fetchafterTask()
    getDataUser()
  }, [])
  useEffect(() => {
    if (idJF) {
      fetchListTask()
      fetchListMember()
    }

    setLoading(false)
  }, [idJF])
  useEffect(() => {
    setDescription(infoTask.description_of_detail)
  }, [infoTask])
  useEffect(() => {
    const timer = setTimeout(() => {
      setReRender(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [infoTask.description_of_detail])
  const listStatus = ['?????????', '?????????', '??????', '??????', '?????????']
  const onTyping = (value) => {
    if (value !== '') {
      setInfoTask({ ...infoTask, description_of_detail: value })
    }
  }
  // ant-select-selector
  return (
    <div>
      <Loading loading={loading} overlay={loading} />
      <JfLayout id={idJF} bgr={2}>
        <JfLayout.Main>
          <h1>??????????????? </h1>
          <div className="edit-task">
            <Form
              form={form}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              layout="horizontal"
              colon={false}
              initialValues={{ defaultInputValue: 0 }}
              onFinish={onFinishSuccess}
              onFinishFailed={onFinishFailed}
            >
              <div className="grid grid-cols-2">
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    label="????????????"
                    name="name"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Input
                      id="validate_name"
                      className="validate_name"
                      type="text"
                      placeholder="???????????????????????????"
                      maxLength={20}
                      size="large"
                      onChange={onValueNameChange}
                    />
                  </Form.Item>
                  <div className="ant-row">
                    <div className="ant-col ant-col-6" />
                    <div className="ant-col ant-col-18">
                      <span
                        id="error-msg"
                        style={{ color: '#ff3860', fontSize: '14px' }}
                        className="text-red-600"
                        hidden
                      >
                        ???????????????????????????????????????
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="????????????" name="category">
                    <span>{infoTask.categories ? infoTask.categories.join(', ') : null}</span>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="?????????????????????" name="milestone">
                    <span>{infoTask.milestone}</span>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="??????" name="effort">
                    <div className="row-ef pl-1">
                      {infoTask.unit === 'none' ? (
                        <>
                          <span className="eff">{infoTask.effort}</span>
                          <span className="ef">{infoTask.is_day ? '???' : '??????'}</span>
                        </>
                      ) : (
                        <>
                          <span className="eff">{infoTask.effort}</span>
                          <span className="ef">{infoTask.is_day ? '???' : '??????'}</span>
                          <span>/</span>
                          {infoTask.unit === 'students' ? (
                            <span className="ef">?????????</span>
                          ) : (
                            <span className="ef">?????????</span>
                          )}
                        </>
                      )}
                    </div>
                  </Form.Item>
                </div>

                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    name="start_time"
                    label="?????????"
                    required
                    className="big-icon"
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    name="end_time"
                    className="big-icon"
                    label="?????????"
                    required
                    rules={[
                      {
                        validator: EndDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="???????????????" name="taskBefore" className="tag_a">
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      onChange={filtedArr}
                    >
                      {beforeTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="???????????????" name="afterTask" className="tag_a">
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      onChange={filtedArr}
                    >
                      {afterTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="?????????" name="assignee" required className="multiples">
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
                        style={{
                          width: '100%',
                          border: '1px solid red',
                          borderRadius: 6,
                        }}
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
                  <div className="ant-row">
                    <div className="ant-col ant-col-6" />
                    <div className="ant-col ant-col-18">
                      <span
                        id="error-user"
                        style={{ color: '#ff3860', fontSize: '14px' }}
                        className="text-red-600"
                        hidden
                      >
                        ???????????????????????????
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    label="???????????????"
                    name="status"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      className="addJF-selector"
                      placeholder="???????????????"
                    >
                      {listStatus.map((element) => (
                        <Select.Option value={element}>{element}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div
                  style={
                    countUserAs && countUserAs.length < 2
                      ? { display: 'none' }
                      : { display: 'block' }
                  }
                  className="col-span-1 mx-2 mb-2"
                >
                  <Form.Item label="???????????????" name="reviewers" className="tag_a">
                    <Select
                      showArrow
                      size="large"
                      tagRender={tagRender}
                      style={{ width: '100%', transition: '0' }}
                      onChange={onReviewersChange}
                    >
                      {reviewersSelectTag.map((element) => (
                        <Select.Option
                          className="validate-user"
                          key={element.id}
                          value={element.id}
                        >
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-2 mx-2 mb-2">
                  {reRender && <Editor jfID={jfID} value={description} onChange={onTyping} />}
                </div>
              </div>
              <div className="flex justify-end mr-2">
                <Form.Item label=" " className=" ">
                  <div className="flex ">
                    <Button
                      size="large"
                      htmlType="button"
                      type="primary"
                      onClick={cancelConfirmModle}
                      disabled={disableBtn}
                      className="button_cancel mx-3"
                    >
                      ???????????????
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      disabled={disableBtn}
                      loading={disableBtn}
                    >
                      ??????
                    </Button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
EditTask.getInitialProps = async (ctx) => {
  const taskId = parseInt(ctx.query.id, 10)
  const userId = ctx.store.getState().get('auth').get('user').get('id')
  if (userId) {
    try {
      await axios.get(`${ctx.serverURL}/is-admin-task`, {
        params: { userId, taskId },
      })
    } catch (err) {
      ctx.res?.writeHead(302, { Location: '/error' })
      ctx.res?.end()
    }
  }
  return {}
}
EditTask.middleware = ['auth:superadmin', 'auth:member']
export default EditTask
