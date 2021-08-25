import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Form,
  Spin,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import addTemplateTasksAPI from '../../api/add-template-task'
import OtherLayout from '../../layouts/OtherLayout'
import * as Extensions from '../../utils/extensions'
// import useUnsavedChangesWarning from '../../components/load_more'
import './style.scss'

const index = () => {
  // page state.
  const [listCatergories, setlistCatergories] = useState([])
  const [listMilestones, setlistMilestones] = useState([])
  const [templateTasks, settemplateTasks] = useState([])
  const [isTemplateExisted, setIsTemplateExisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [beforeTasks, setPreTasks] = useState([])
  const [afterTasks, setAfterTasks] = useState([])
  // const [selectedItems, setSelectedItems] = useState([])
  const { TextArea } = Input

  const [disableBtn, setdisableBtn] = useState(false)
  const [form] = Form.useForm()
  // const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning()
  const router = useRouter()
  const unitData = [
    { id: 'students', name: '学生数' },
    { id: 'companies', name: '企業数' },
    { id: 'none', name: 'None' },
  ]

  const isDayData = [
    { id: 0, name: '時間' },
    { id: 1, name: '日' },
  ]
  // check if all input is empty.
  const checkIsFormInputEmpty = () => {
    // get all input values .
    const inputValues = form.getFieldsValue()
    //  return type :[]
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (element) {
        return false
      }
    }
    return true
  }
  // const convertTaskToOptions = (tasks) => {
  //   const options = []
  //   Object.values(tasks).forEach((element) => {
  //     const dummyObj = { value: '' }
  //     dummyObj.value = element.name
  //     options.push(dummyObj)
  //   })
  //   return options
  // }
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const categories = await addTemplateTasksAPI.getListTemplateCategories()
        const milestones = await addTemplateTasksAPI.getListTemplateMilestone()
        const tasks = await addTemplateTasksAPI.getAllTemplateTasks()
        setlistCatergories(Array.from(categories.data))
        setlistMilestones(Array.from(milestones.data))
        settemplateTasks(Array.from(tasks.data))
        setAfterTasks(tasks.data)
        setPreTasks(tasks.data)
        return null
      } catch (error) {
        return Error(error.toString())
      }
    }
    fetchAPI()
  }, [])

  /* utilities function for support handle form */
  // reset form.
  const onFormReset = () => {
    form.resetFields()
  }

  const autoConvertHalfwidth = (event) => {
    // get FormItem name of this input
    const inputRef = event.target.id
    const dummyObject = {}
    dummyObject[inputRef] = Extensions.toHalfWidth(event.target.value)
    if (inputRef) {
      form.setFieldsValue(dummyObject)
    }
  }
  // route function handle all route in this page.
  const routeTo = async (url) => {
    // await router.prefetch(url)
    // await router.push(url)

    router.prefetch(url)
    router.push(url)
  }

  /* Handle 2 form event when user click  キャンセル button or  登録 button */
  const onFinishFailed = (errorInfo) => errorInfo

  /* handle modal or popup to notifiy to user */

  //  open prompt after cancel button clicked .
  const cancelConfirmModle = () => {
    if (checkIsFormInputEmpty()) {
      routeTo('/template-tasks')
    } else {
      Modal.confirm({
        title: '入力内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          onFormReset()
          routeTo('/template-tasks')
        },
        onCancel: () => {},
        okText: 'はい',
        centered: true,
        cancelText: 'いいえ',
      })
    }
  }
  //  open success notification after add button clicked .
  const successNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に登録されました。',
      onClick: () => {},
    })
  }

  // handle user click add template task and response from serve.
  const onFinishSuccess = async (values) => {
    if (!isTemplateExisted) {
      try {
        const beforeID = []
        const afterIDs = []

        if (values.beforeTasks && values.afterTasks) {
          templateTasks.forEach((e) => {
            if (values.beforeTasks.includes(e.name)) {
              beforeID.push(e.id)
            }
            if (values.afterTasks.includes(e.name)) {
              afterIDs.push(e.id)
            }
            return ''
          })
        }
        const data = {
          name: values.template_name,
          description_of_detail: values.detail,
          milestone_id: values.milestone_id,
          is_day: values.isDay,
          unit: values.unit,
          effort: values.effort * 1.0,
          category_id: values.category_id,
          beforeTasks: beforeID,
          afterTasks: afterIDs,
        }
        setdisableBtn(true)
        setLoading(true)
        const response = await addTemplateTasksAPI.addTemplateTask(data)

        if (response.status < 299) {
          await successNotification()
          routeTo(`/template-task-dt/${response.data.id}`)
        } else {
          setdisableBtn(false)
          setLoading(false)
        }
        return response
      } catch (error) {
        const isDuplicate = JSON.parse(error.request.response).message
        if (isDuplicate.toLocaleLowerCase().includes('duplicate')) {
          notification.open({
            icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
            duration: 3,
            message: 'このJF名は既に使用されています。',
            onClick: () => {},
          })
        } else {
          notification.open({
            icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
            duration: 3,
            message: '保存に失敗しました。',
            onClick: () => {},
          })
        }
        setdisableBtn(false)
        setLoading(false)
        return error
      }
    }
    return ''
  }

  /* Validator of all input. */
  const templateTaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    if (value.match(Extensions.Reg.specialCharacter)) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }
    // if (isTemplateExisted === true) {
    //   return Promise.reject(new Error('da ton tai'))
    // }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }

    return Promise.resolve()
  }
  const isDayAndUnitValidator = (_, value) => {
    if (value === undefined) {
      return Promise.reject()
    }
    return Promise.resolve()
  }
  const categoryValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    return Promise.resolve()
  }
  const milestoneValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }
  const numberInputValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    // console.log(Extensions.toHalfWidth(parseInt(value.toString(), 10)))
    if (value <= 0) {
      return Promise.reject(new Error('0以上の数字で入力してください'))
    }
    if (Extensions.isFullWidth(value)) {
      // return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    }

    // setinputTest(Extention.toHalfWidth(value.toString()))
    if (
      !Extensions.isFullWidth(value)
      && !Extensions.Reg.floatNumber.test(value * 1.0)
    ) {
      return Promise.reject(new Error('使用できない文字が含まれています。'))
    }

    return Promise.resolve()
  }
  /* Validator of all input end */

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        // style={{ marginRight: 3, paddingTop: "4px", marginBottom: "4px" }}
      >
        <Tooltip title={label}>
          <span
            onClick={() => {
              const id = templateTasks.find((e) => e.name === value)
              routeTo(`/template-task-dt/${id.id}`)
            }}
            className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
            style={{ maxWidth: '20ch' }}
          >
            {label}
            {/* <a href="" className="my-1">{label}</a> */}
          </span>
        </Tooltip>
      </Tag>
    )
  }
  const isTemplateTaskExisted = async () => {
    try {
      const templateName = form.getFieldValue('template_name')
      if (templateName) {
        const response = await addTemplateTasksAPI.isTemplateTaskExisted({
          name: templateName,
        })
        if (response.data.length) {
          setIsTemplateExisted(true)
          document.getElementById('validate_name').style.border = '1px solid red'
          return document.getElementById('error-msg').removeAttribute('hidden')
        }

        setIsTemplateExisted(false)
      }
      return null
    } catch (error) {
      return null
    }
  }
  const filtedArr = () => {
    const before = form.getFieldsValue().beforeTasks
    const after = form.getFieldsValue().afterTasks
    let selectedItems = []
    if (before && !after) {
      selectedItems = [...selectedItems, ...before]
    } else if (!before && after) {
      selectedItems = [...selectedItems, ...after]
    } else if (before && after) {
      selectedItems = [...before, ...after]
    }
    const filted = templateTasks.filter((e) => !selectedItems.includes(e.name))
    setAfterTasks(filted)
    setPreTasks(filted)
    return filted
  }

  const loadingIcon = (
    <LoadingOutlined style={{ fontSize: 30, color: '#ffd803' }} spin />
  )
  return (
    <>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="add-template-task-page">
            <div id="loading">
              <Spin
                style={{ fontSize: '30px', color: '#ffd803' }}
                spinning={loading}
                indicator={loadingIcon}
                size="large"
              >
                <h1>テンプレートタスク追加 </h1>
                <div className="h-screen flex flex-col items-center pt-10 bg-white my-8">
                  <Form
                    className="place-self-center add-template-form space-y-12 w-5/6"
                    form={form}
                    labelCol={{
                      span: 6,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    initialValues={{ defaultInputValue: 0 }}
                    onFinish={onFinishSuccess}
                    onFinishFailed={onFinishFailed}
                  >
                    <div className="grid grid-cols-2">
                      <div className="col-span-1 mx-4">
                        {/* template task name */}
                        <Form.Item
                          label="テンプレートタスク名"
                          labelAlign="left"
                          name="template_name"
                          className="justify-evenly"
                          required
                          rules={[
                            {
                              validator: templateTaskNameValidator,
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            id="validate_name"
                            onBlur={isTemplateTaskExisted}
                            onChange={() => {
                              document
                                .getElementById('error-msg')
                                .setAttribute('hidden', 'true')
                              document.getElementById(
                                'validate_name',
                              ).style.border = '1px solid #e5e7eb'
                            }}
                            placeholder="タスクテンプレート名を入力する"
                            maxLength={200}
                          />
                        </Form.Item>

                        <span
                          id="error-msg"
                          style={{
                            color: '#ff3860',
                            fontSize: '14px',
                          }}
                          className="text-red-600"
                          hidden
                        >
                          この名前はすでに存在します
                        </span>
                      </div>

                      <div className="col-span-1 mx-4">
                        {/* category */}
                        <Form.Item
                          labelAlign="left"
                          className="justify-evenly"
                          required
                          // hasFeedback
                          label="カテゴリ"
                          name="category_id"
                          rules={[
                            {
                              validator: categoryValidator,
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showArrow
                            allowClear
                            className="addJF-selector "
                            placeholder="カテゴリを選択"
                          >
                            {listCatergories.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.id}
                              >
                                {element.category_name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <div className="col-span-1 mx-4">
                        {/* milestone */}
                        <Form.Item
                          required
                          // hasFeedback
                          labelAlign="left"
                          className="justify-evenly"
                          name="milestone_id"
                          label="マイルストーン"
                          rules={[
                            {
                              validator: milestoneValidator,
                            },
                          ]}
                        >
                          <Select
                            showArrow
                            allowClear
                            size="large"
                            className="addJF-selector "
                            placeholder="マイルストーンを選択"
                          >
                            {listMilestones.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.id}
                              >
                                {element.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <div className="col-span-1 mx-4">
                        {/* Kōsū - effort  */}
                        <Form.Item
                          label="工数"
                          required
                          labelAlign="left"
                          className="justify-evenly"
                        >
                          <div className="flex flex-row justify-between ">
                            <Form.Item
                              className="w-1/2 max-w-xs flex-1"
                              name="effort"
                              rules={[
                                {
                                  validator: numberInputValidator,
                                },
                              ]}
                            >
                              <Input
                                style={{ width: '80px' }}
                                type="text"
                                min={1}
                                value={0}
                                onChange={autoConvertHalfwidth}
                              />
                            </Form.Item>

                            <Space>
                              {/* ----------------- */}
                              <Form.Item
                                name="isDay"
                                required
                                rules={[
                                  {
                                    validator: isDayAndUnitValidator,
                                  },
                                ]}
                              >
                                <Select
                                  style={{ width: '150px' }}
                                  showArrow
                                  showSearch={false}
                                  placeholder="時間"
                                >
                                  {isDayData.map((element) => (
                                    <Select.Option
                                      key={element.id}
                                      value={element.id}
                                    >
                                      {element.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <p className="slash-devider text-2xl font-extrabold mb-7">
                                {' '}
                                /
                                {' '}
                              </p>
                              <Form.Item
                                name="unit"
                                required
                                rules={[
                                  {
                                    validator: isDayAndUnitValidator,
                                  },
                                ]}
                              >
                                <Select
                                  style={{ width: '150px' }}
                                  showArrow
                                  showSearch={false}
                                  placeholder="学生数"
                                >
                                  {unitData.map((element) => (
                                    <Select.Option
                                      key={element.id}
                                      value={element.id}
                                    >
                                      {element.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Space>
                          </div>
                        </Form.Item>
                      </div>

                      <div className="col-span-1 mx-4">
                        <Form.Item
                          label="前のタスク:"
                          name="beforeTasks"
                          className="justify-evenly"
                          labelAlign="left"
                        >
                          <Select
                            mode="multiple"
                            showArrow
                            allowClear
                            tagRender={tagRender}
                            className="w-100"
                            placeholder="リレーションを選択"
                            onChange={filtedArr}
                          >
                            {beforeTasks.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.name}
                              >
                                {element.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <div className="col-span-1 mx-4">
                        <Form.Item
                          label="次のタスク:"
                          name="afterTasks"
                          className="justify-evenly"
                          labelAlign="left"
                        >
                          <Select
                            mode="multiple"
                            showArrow
                            allowClear
                            tagRender={tagRender}
                            className="w-100"
                            placeholder="リレーション"
                            onChange={filtedArr}
                          >
                            {afterTasks.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.name}
                              >
                                {element.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="description-add">
                      <Form.Item
                        name="detail"
                        className="justify-evenly w-full"
                      >
                        <TextArea
                          rows={7}
                          placeholder="何かを入力してください"
                        />
                      </Form.Item>
                    </div>

                    {/* 2 button */}

                    <Form.Item label=" " colon={false} className="my-10">
                      <div className="submit-btn-add flex justify-end ">
                        <Button
                          htmlType="button"
                          className="ant-btn"
                          onClick={cancelConfirmModle}
                          disabled={disableBtn}
                          loading={disableBtn}
                        >
                          キャンセル
                        </Button>
                        {/* --------------------------- */}
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={disableBtn}
                          loading={disableBtn}
                          className="text-base px-10"
                          style={{ letterSpacing: '-1px', marginLeft: '2rem' }}
                        >
                          登録
                        </Button>
                      </div>
                    </Form.Item>

                    {/* end form */}
                  </Form>
                </div>
              </Spin>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </>
  )
}

export default index
