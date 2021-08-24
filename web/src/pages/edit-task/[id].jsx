import React, { useEffect, useState } from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { Form, Input, Select, Tag, DatePicker } from 'antd'
import moment from 'moment'
import JfLayout from '../../layouts/layout-task'
import {
  taskData, beforeTask, afterTask,
} from '../../api/task-detail'
import { jftask } from '../../api/jf-toppage'
import * as Extensions from '../../utils/extensions'

export default function TaskList() {
  const dateFormat = 'YYYY/MM/DD'
  const { TextArea } = Input
  const router = useRouter()
  const idTask = router.query.id
  const [form] = Form.useForm()
  const [beforeTasksNew, setBeforeTaskNew] = useState([])
  const [afterTasksNew, setafterTaskNew] = useState([])
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
  const [idJF, setIdJF] = useState(null)
  const fetchTaskData = async () => {
    await taskData(idTask)
      .then((response) => {
        setInfoTask({
          name: response.data.name,
          categories: response.data.categories[0].category_name,
          milestone: response.data.milestone.name,
          status: response.data.status,
          start_time: response.data.start_time,
          end_time: response.data.end_time,
          effort: response.data.template_task.effort,
          is_day: response.data.template_task.is_day,
          unit: response.data.template_task.unit,
          description_of_detail: response.data.description_of_detail,
        })

        setIdJF(
          response.data.schedule.jobfair.id,

        )
        // eslint-disable-next-line no-use-before-define
        fetchListTask()
        const listmember = []
        response.data.users.forEach((element) => {
          listmember.push(element.name)
        })
        form.setFieldsValue({
          name: response.data.name,
          category: response.data.categories[0].category_name,
          milestone: response.data.milestone.name,
          assignee: listmember,
          status: response.data.status,
          start_time: moment(response.data.start_time.split('-').join('/'), dateFormat),
          end_time: moment(response.data.end_time.split('-').join('/'), dateFormat),
          detail: response.data.description_of_detail,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }

  function tagRender(props) {
    // eslint-disable-next-line react/prop-types
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }
  const TaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value.match(Extensions.Reg.specialCharacter)) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }
    if (value.match(Extensions.Reg.vietnamese)) {
      return Promise.reject(new Error('ベトナム語は入力できない'))
    }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }

    return Promise.resolve()
  }
  const onValueNameChange = (e) => {
    form.setFieldsValue({
      name: e.target.value,
    })
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
        console.log(error)
      })
  }
  const fetchafterTask = async () => {
    await afterTask(idTask).then((response) => {
      const listatTask = []
      response.data.after_tasks.forEach((element) => {
        listatTask.push(element.name)
      })
      console.log(listatTask)
      form.setFieldsValue({
        afterTask: listatTask,
      })
    }).catch((error) => {
      console.log(error)
    })
  }
  const fetchListTask = async () => {
    await jftask(idJF).then((response) => {
      setBeforeTaskNew(response.data.schedule.tasks)
      setafterTaskNew(response.data.schedule.tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  const options = []
  const optionsAt = []
  useEffect(() => {
    fetchTaskData()
    fetchBeforeTask()
    fetchafterTask()
    fetchListTask()
    beforeTasksNew.forEach((element) => {
      options.push({ value: element.name })
    })

    afterTasksNew.forEach((element) => {
      optionsAt.push({ value: element.name })
    })
  }, [idJF])
  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']
  return (
    <div>
      <JfLayout id={idJF}>
        <JfLayout.Main>
          <h1>タスク編集 </h1>
          <div className="edit-task">
            <Form
              form={form}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
              }}
              layout="horizontal"
              colon={false}
              initialValues={{ defaultInputValue: 0 }}
            //   onFinish={onFinishSuccess}
            //   onFinishFailed={onFinishFailed}
            >
              <div className="grid grid-cols-2 mx-10">
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="タスク名"
                    name="name"
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="タスク名入力する"
                      maxLength={20}
                      onChange={onValueNameChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="カテゴリ"
                    name="category"
                  >
                    <Input
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="マイルストーン"
                    name="milestone"
                  >
                    <Input
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <div className="ef-label">
                    <div className="laybel">
                      <span>工数</span>
                    </div>
                    <div className="row-ef">
                      {infoTask.unit === 'none' ? (
                        <>
                          <span className="ef">{infoTask.effort}</span>
                          <span className="ef">
                            {infoTask.is_day ? '日' : '時間'}
                          </span>

                        </>
                      ) : (
                        <>
                          <span className="ef">{infoTask.effort}</span>
                          <span className="ef">
                            {infoTask.is_day ? '日' : '時間'}
                          </span>
                          <span>/</span>
                          <span className="ef">{infoTask.unit}</span>
                        </>
                      ) }
                    </div>
                  </div>

                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="担当者"
                    name="assignee"
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                    >
                      {beforeTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>

                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="ステータス"
                    name="status"
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Select className="addJF-selector" placeholder="管理者を選択">
                      {listStatus.map((element) => (
                        <Select.Option value={element}>
                          {element}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="start_time"
                    label="開始日"
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>

                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="end_time"
                    label="開始日"
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>

                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="前のタスク"
                    name="taskBefore"
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}

                    >
                      {beforeTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>

                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="次のタスク"
                    name="afterTask"
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}

                    >
                      {afterTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>

                  </Form.Item>
                </div>
                <div className="col-span-2 mx-4">
                  <Form.Item
                    name="detail"
                  >
                    <TextArea rows={10} placeholder="何かを入力してください" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
