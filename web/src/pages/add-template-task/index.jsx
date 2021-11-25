import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
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
import dynamic from 'next/dynamic'
import addTemplateTasksAPI from '../../api/add-template-task'
import OtherLayout from '../../layouts/OtherLayout'
import * as Extensions from '../../utils/extensions'
// import useUnsavedChangesWarning from '../../components/load_more'
import './style.scss'
import MarkDownView from '../../components/markDownView'

const MDEditor = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
)
const index = () => {
  // page state.
  const [markdown, setMarkdown] = useState('')
  const [listCatergories, setlistCatergories] = useState([])
  const [listMilestones, setlistMilestones] = useState([])
  const [templateTasks, settemplateTasks] = useState([])
  const [isTemplateExisted, setIsTemplateExisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [beforeTasks, setPreTasks] = useState([])
  const [afterTasks, setAfterTasks] = useState([])
  const [isPreview, setIsPreview] = useState(false)
  const [chosePreview, setChosePreview] = useState(false)
  const [disableBtn, setdisableBtn] = useState(false)
  const [form] = Form.useForm()
  // const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning()
  const router = useRouter()
  // route function handle all route in this page.
  const routeTo = async (url) => {
    router.prefetch(url)
    router.push(url)
  }
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
  // check if all input is not empty
  const checkIsFormInputNotEmpty = () => {
    // get all input values .
    const inputValues = form.getFieldsValue()
    //  return type :[]
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (!element) {
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
        if (error.response.status === 404) {
          routeTo('/404')
        } else return Error(error.toString())
        return null
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

  /* Handle 2 form event when user click  キャンセル button or  登録 button */
  const onFinishFailed = () => {
    setChosePreview(false)
  }

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
    notification.success({
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
          description_of_detail: markdown,
          milestone_id: values.milestone[1],
          is_day: values.isDay[1],
          unit: values.unit[1],
          effort: values.effort * 1.0,
          category_id: values.category[1],
          beforeTasks: beforeID,
          afterTasks: afterIDs,
        }
        setdisableBtn(true)
        setLoading(true)
        const response = await addTemplateTasksAPI.addTemplateTask(data)

        if (response.status < 299) {
          routeTo(`/template-task-dt/${response.data.id}`)
          successNotification()
        } else {
          setdisableBtn(false)
          setLoading(false)
        }
        return response
      } catch (error) {
        if (error.response.status === 404) {
          routeTo('/404')
        }
        const isDuplicate = JSON.parse(error.request.response).message
        if (isDuplicate.toLocaleLowerCase().includes('duplicate')) {
          notification.error({
            duration: 3,
            message: 'このJF名は既に使用されています。',
            onClick: () => {},
          })
        } else {
          notification.error({
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
  const isDayAndUnitValidator = () => Promise.resolve()
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
        style={{ marginRight: 3, paddingTop: '4px', marginBottom: '4px' }}
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
      if (error.response.status === 404) {
        routeTo('/404')
      }
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
    <LoadingOutlined
      style={{
        fontSize: 30,
        color: '#ffd803',
      }}
      spin
    />
  )
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const [dataPreview, setDataPreview] = useState([])
  const [beforeTasksChoose, setBeforeTasksChoose] = useState([])
  const [afterTasksChoose, setAfterTasksChoose] = useState([])
  const onPreview = (values) => {
    setChosePreview(false)
    if (checkIsFormInputNotEmpty) {
      setIsPreview(true)
      setBeforeTasksChoose(values.beforeTasks)
      setAfterTasksChoose(values.afterTasks)
      const data = {
        name: values.template_name,
        description_of_detail: markdown,
        milestone: values.milestone[0],
        is_day: values.isDay[0],
        unit: values.unit[0],
        effort: values.effort * 1.0,
        category: values.category[0],
      }
      setDataPreview(data)
    }
  }
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
                <div className="container mx-auto flex-1 justify-center px-4  pb-20">
                  {/* page title */}
                  {/* <h1 className="pl-12 text-3xl font-extrabold">テンプレートタスク追加 </h1> */}
                  <div>
                    <div className="container mt-20">
                      <div className="grid justify-items-center">
                        <Form
                          className="place-self-center  add-template-form"
                          form={form}
                          labelCol={{
                            span: 6,
                          }}
                          wrapperCol={{
                            span: 13,
                          }}
                          layout="horizontal"
                          colon={false}
                          initialValues={{
                            defaultInputValue: 0,
                            isDay: [isDayData[0].name, isDayData[0].id],
                            unit: [unitData[0].name, unitData[0].id],
                          }}
                          onFinish={chosePreview ? onPreview : onFinishSuccess}
                          onFinishFailed={onFinishFailed}
                        >
                          <div className="flex">
                            <div className="left-side mx-4 w-1/2">
                              <div className="container ">
                                {/* template task name */}
                                <Form.Item
                                  label="テンプレートタスク名"
                                  required={!isPreview}
                                >
                                  <Form.Item
                                    name="template_name"
                                    noStyle
                                    rules={[
                                      {
                                        validator: templateTaskNameValidator,
                                      },
                                    ]}
                                  >
                                    <Input
                                      type="text"
                                      size="large"
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
                                      style={{
                                        display: isPreview ? 'none' : '',
                                      }}
                                      placeholder="タスクテンプレート名を入力する"
                                      maxLength={200}
                                    />
                                  </Form.Item>
                                  <p
                                    style={{ display: isPreview ? '' : 'none' }}
                                  >
                                    {dataPreview.name}
                                  </p>
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
                                </Form.Item>

                                {/* milestone */}
                                <Form.Item
                                  label="マイルストーン"
                                  required={!isPreview}
                                >
                                  <Form.Item
                                    noStyle
                                    // hasFeedback
                                    name="milestone"
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
                                      style={{
                                        display: isPreview ? 'none' : '',
                                      }}
                                    >
                                      {listMilestones.map((element) => (
                                        <Select.Option
                                          key={element.id}
                                          value={[element.name, element.id]}
                                        >
                                          {element.name}
                                        </Select.Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  <p
                                    style={{ display: isPreview ? '' : 'none' }}
                                  >
                                    {dataPreview.milestone}
                                  </p>
                                </Form.Item>

                                {/* relation */}
                                {/* <Form.Item
                                  label=" "
                                  colon={false}
                                >
                                  <p className="label">前のタスク:</p>

                                </Form.Item> */}
                                <Form.Item label="前のタスク">
                                  <Form.Item
                                    noStyle
                                    className="task ml-3"
                                    name="beforeTasks"
                                  >
                                    <Select
                                      mode="multiple"
                                      size="large"
                                      showArrow
                                      allowClear
                                      tagRender={tagRender}
                                      className="w-100"
                                      placeholder="リレーションを選択"
                                      onChange={filtedArr}
                                      style={{
                                        display: isPreview ? 'none' : '',
                                      }}
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
                                  {beforeTasksChoose ? (
                                    <ul
                                      className="list__task col-span-2"
                                      style={{
                                        border: '1px solid #d9d9d9',
                                        display: isPreview ? '' : 'none',
                                      }}
                                    >
                                      {beforeTasksChoose.map((element) => (
                                        <li className="task__chil">
                                          <Tag
                                            style={{
                                              marginRight: 3,
                                              paddingTop: '5px',
                                              paddingBottom: '3px',
                                            }}
                                          >
                                            <Tooltip
                                              placement="top"
                                              title={element}
                                            >
                                              <div className="inline-block text-blue-600 whitespace-nowrap">
                                                {truncate(element)}
                                              </div>
                                            </Tooltip>
                                          </Tag>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <ul
                                      className="list__task col-span-2"
                                      style={{
                                        border: '1px solid #d9d9d9',
                                        display: isPreview ? '' : 'none',
                                      }}
                                    />
                                  )}
                                </Form.Item>
                              </div>
                            </div>
                            <div className="right-side mx-4 w-1/2">
                              {/* category */}
                              <Form.Item
                                required={!isPreview}
                                // hasFeedback
                                label="カテゴリ"
                              >
                                <Form.Item
                                  noStyle
                                  name="category"
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
                                    style={{ display: isPreview ? 'none' : '' }}
                                  >
                                    {listCatergories.map((element) => (
                                      <Select.Option
                                        key={element.id}
                                        value={[
                                          element.category_name,
                                          element.id,
                                        ]}
                                      >
                                        {element.category_name}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <p style={{ display: isPreview ? '' : 'none' }}>
                                  {dataPreview.category}
                                </p>
                              </Form.Item>

                              {/* Kōsū - effort  */}
                              <Form.Item label="工数" required={!isPreview}>
                                <Space className="space-items-special flex justify-between " style={{ display: isPreview ? 'none' : '' }}>
                                  <div className="w-1/2 max-w-xs flex-grow ">
                                    <Form.Item
                                      noStyle
                                      name="effort"
                                      required={!isPreview}
                                      rules={[
                                        {
                                          validator: numberInputValidator,
                                        },
                                      ]}
                                    >
                                      <Input
                                        style={{
                                          padding: '10px',
                                          width: '180%',
                                          display: isPreview ? 'none' : '',
                                        }}
                                        type="text"
                                        size="large"
                                        min={1}
                                        value={0}
                                        onChange={autoConvertHalfwidth}
                                      />
                                    </Form.Item>
                                  </div>
                                  {/* ----------------- */}
                                  <div className="w-100 flex flex-shrink  justify-center align-middle  flex-row w-100">
                                    <Form.Item
                                      noStyle
                                      name="isDay"
                                      required={!isPreview}
                                    >
                                      <Select
                                        className="special-selector w-100 "
                                        showArrow
                                        size="large"
                                        showSearch={false}
                                        placeholder="時間"
                                        style={{
                                          display: isPreview ? 'none' : '',
                                        }}

                                      >
                                        {isDayData.map((element) => (
                                          <Select.Option
                                            key={element.id}
                                            value={[element.name, element.id]}
                                          >
                                            {element.name}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <p
                                      className="slash-devider text-3xl font-extrabold leading-10"
                                      style={{
                                        display: isPreview ? 'none' : '',
                                      }}
                                    >
                                      {' '}
                                      /
                                    </p>
                                    <Form.Item
                                      noStyle
                                      name="unit"
                                      required={!isPreview}
                                      rules={[
                                        {
                                          validator: isDayAndUnitValidator,
                                        },
                                      ]}
                                    >
                                      <Select
                                        size="large"
                                        className="special-selector"
                                        showArrow
                                        showSearch={false}
                                        placeholder="学生数"
                                        style={{
                                          display: isPreview ? 'none' : '',
                                        }}
                                        value={[unitData[0].name, unitData[0].id]}
                                      >
                                        {unitData.map((element) => (
                                          <Select.Option
                                            key={element.id}
                                            value={[element.name, element.id]}
                                          >
                                            {element.name}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                </Space>
                                <p style={{ display: isPreview ? '' : 'none' }}>
                                  {dataPreview.effort}
                                  {' '}
                                  {' '}
                                  {dataPreview.is_day}
                                  /
                                  {dataPreview.unit}
                                </p>
                              </Form.Item>

                              {/* <Form.Item
                                label=" "
                                colon={false}

                              >
                                <p className="label">次のタスク:</p>

                              </Form.Item> */}
                              <Form.Item label="次のタスク">
                                <Form.Item
                                  noStyle
                                  name="afterTasks"
                                  className="task ml-3"
                                >
                                  <Select
                                    mode="multiple"
                                    size="large"
                                    showArrow
                                    allowClear
                                    tagRender={tagRender}
                                    className="w-100"
                                    placeholder="リレーションを選択"
                                    onChange={filtedArr}
                                    style={{ display: isPreview ? 'none' : '' }}
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
                                {afterTasksChoose ? (
                                  <ul
                                    className="list__task col-span-2"
                                    style={{
                                      border: '1px solid #d9d9d9',
                                      display: isPreview ? '' : 'none',
                                    }}
                                  >
                                    {afterTasksChoose.map((element) => (
                                      <li className="task__chil">
                                        <Tag
                                          style={{
                                            marginRight: 3,
                                            paddingTop: '5px',
                                            paddingBottom: '3px',
                                          }}
                                        >
                                          <Tooltip
                                            placement="top"
                                            title={element}
                                          >
                                            <div className="inline-block text-blue-600 whitespace-nowrap">
                                              {truncate(element)}
                                            </div>
                                          </Tooltip>
                                        </Tag>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <ul
                                    className="list__task col-span-2"
                                    style={{
                                      border: '1px solid #d9d9d9',
                                      display: isPreview ? '' : 'none',
                                    }}
                                  />
                                )}
                              </Form.Item>
                            </div>
                          </div>
                          {/* details    */}
                          <div
                            className="pr-3 pl-14 mb-2"
                            style={{ display: isPreview ? 'none' : '' }}
                          >
                            <MDEditor
                              style={{ height: '40px !important' }}
                              preview="edit"
                              height="300"
                              value={markdown}
                              onChange={setMarkdown}
                            />
                          </div>
                          <div
                            className="pr-3 ml-14 mb-2 des"
                            style={{ display: isPreview ? '' : 'none' }}
                          >
                            <MarkDownView source={markdown} />
                          </div>

                          {/* 2 button */}
                          <div className="mt-8 flex justify-end -mr-4">
                            <Form.Item label=" " colon={false}>
                              <Space
                                size={20}
                                style={{ display: isPreview ? 'none' : '' }}
                              >
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
                                  className="preview_btn"
                                  htmlType="submit"
                                  onClick={() => {
                                    setChosePreview(!chosePreview)
                                  }}
                                  disabled={disableBtn}
                                  loading={disableBtn}
                                  style={{ letterSpacing: '-1px' }}
                                >
                                  プレビュー
                                </Button>
                                {/* --------------------------- */}
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  disabled={disableBtn}
                                  loading={disableBtn}
                                  style={{ letterSpacing: '-1px' }}
                                >
                                  登録
                                </Button>
                              </Space>
                              <div
                                style={{ display: isPreview ? '' : 'none' }}
                                className="flex justify-end mr-4"
                              >
                                <Space size={20}>
                                  <Button
                                    htmlType="button"
                                    onClick={() => {
                                      setIsPreview(false)
                                    }}
                                    disabled={disableBtn}
                                    loading={disableBtn}
                                    style={{ letterSpacing: '-1px' }}
                                  >
                                    編集
                                  </Button>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={disableBtn}
                                    loading={disableBtn}
                                    style={{ letterSpacing: '-1px' }}
                                  >
                                    登録
                                  </Button>
                                </Space>
                              </div>
                            </Form.Item>
                          </div>

                          {/* end form */}
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </>
  )
}

index.middleware = ['auth:superadmin']
export default index
