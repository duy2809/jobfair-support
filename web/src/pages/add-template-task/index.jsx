import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons'
import {
  Button, Form,
  Input, Modal,

  notification,
  Select,
  Tag,
  Space,
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
  const { TextArea } = Input

  const [numberInput, setnumberInput] = useState()
  const [disableBtn, setdisableBtn] = useState(false)
  const [form] = Form.useForm()
  // const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning()
  const router = useRouter()

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
  const convertTaskToOptions = (tasks) => {
    console.log(tasks)
  }
  useEffect(() => {
    // Extensions.unSaveChangeConfirm(true)

    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const categories = await addTemplateTasksAPI.getListTemplateCategories()
        const milestones = await addTemplateTasksAPI.getListTemplateMilestone()
        const tasks = await addTemplateTasksAPI.getAllTemplateTasks()
        setlistCatergories(Array.from(categories.data))
        setlistMilestones(Array.from(milestones.data))
        settemplateTasks(Array.from(tasks.data))

        // Extensions.unSaveChangeConfirm(true)
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
    // const ans = parseInt(Extensions.toHalfWidth(event.target.value), 10)
    if (Extensions.isFullWidth(event.target.value)) {
      const ans = Extensions.toHalfWidth(event.target.value)
      console.log(ans * 1)
      if (ans * 1) {
        setnumberInput(ans)
      }
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
      routeTo('/jobfairs')
    } else {
      Modal.confirm({
        title: '入力内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          onFormReset()
          routeTo('/jobfairs')
        },
        onCancel: () => {},
        okText: 'はい',
        cancelText: 'いいえ',
      })
    }
  }
  //  open success notification after add jobfair button clicked .
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に登録されました。',
      onClick: () => {},
    })
  }

  // handle user click add job fair.
  const onFinishSuccess = async (values) => {
    try {
      Extensions.unSaveChangeConfirm(false)
      const data = {
        name: values.name.toString(),
        schedule_id: values.schedule_id * 1.0,
        start_date: values.start_date.format(Extensions.dateFormat),
        number_of_students: values.number_of_students * 1.0,
        number_of_companies: values.number_of_companies * 1.0,
        jobfair_admin_id: values.jobfair_admin_id * 1.0,
      }
      setdisableBtn(true)
      const response = await addTemplateTasksAPI.addJF(data)

      if (response.status < 299) {
        await saveNotification()
        routeTo(`/jf-toppage/${response.data.id}`)
      } else {
        setdisableBtn(false)
      }

      return response
    } catch (error) {
      setdisableBtn(false)
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
      return error
    }
  }

  // handle when ever selector change.
  // const onmilestoneselect = (_, event) => {
  //   const scheduleId = event.key
  // }

  /* Validator of all input. */
  const templateTaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    if (value.match(Extensions.Reg.specialCharacter)) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }

    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
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
    if (!Extensions.isFullWidth(value) && (!value.match(Extensions.Reg.onlyNumber))) {
      return Promise.reject(new Error('使用できない文字が含まれています。'))
    }

    return Promise.resolve()
  }
  /* Validator of all input end */

  function tagRender(props) {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    console.log(props)
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        <a href="">{label}</a>
      </Tag>
    )
  }

  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="add-template-task-page">
          <div className="container mx-auto flex-1 justify-center px-4  pb-20">
            {/* page title */}
            <h1 className="pl-12 text-3xl font-extrabold">テンプレートタスク追加 </h1>
            <div>
              <div className="container mt-20">
                <div className="grid justify-items-center">
                  <Form
                    className="place-self-center w-3/4"
                    form={form}
                    labelCol={{
                      span: 6,
                    }}
                    wrapperCol={{
                      span: 13,
                    }}
                    layout="horizontal"
                    colon
                    initialValues={{ defaultInputValue: 0 }}
                    onFinish={onFinishSuccess}
                    onFinishFailed={onFinishFailed}
                  >
                    {/* template task name */}
                    <Form.Item
                      label="タスクテンプレート名"
                      name="template-name"
                      required
                      // hasFeedback
                      rules={[
                        {
                          validator: templateTaskNameValidator,
                        },

                      ]}
                    >

                      <Input
                        type="text"
                        // name="template-name"
                        placeholder="タスクテンプレート名を入力する"
                        maxLength={200}
                      />
                      <p className="text-red-600" />
                      {/* <HelpBlock>
                        <p className="text-danger">{this.state.lastNameErr}</p>
                      </HelpBlock> */}
                    </Form.Item>

                    {/* category */}
                    <Form.Item
                      required
                      // hasFeedback
                      label="カテゴリー"
                      name="category"
                      rules={[
                        {
                          validator: categoryValidator,
                        },
                      ]}
                    >
                      <Select
                        showArrow
                        placeholder="カテゴリー"
                      >
                        {listCatergories.map((element) => (
                          <Select.Option key={element.id} value={element.id}>
                            {element.category_name}
                          </Select.Option>
                        ))}
                      </Select>
                      {/* <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
                        {children}
                      </Select> */}

                    </Form.Item>

                    {/* milestone */}
                    <Form.Item
                      required
                      // hasFeedback
                      name="milestone"
                      label="マイルストーン"
                      rules={[
                        {
                          validator: milestoneValidator,
                        },
                      ]}
                    >
                      <Select
                        showArrow
                        className="addJF-selector"
                        placeholder="JF-スケジュールを選択"
                      >
                        {listMilestones.map((element) => (
                          <Select.Option key={element.id} value={element.id}>
                            {element.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* relation */}
                    <Form.Item
                      label="リレーション"
                      className=""
                      name="relation"
                    >
                      <p className="mt-2">前のタスク:</p>
                      <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: '100%' }}
                        options={convertTaskToOptions(templateTasks)}
                      />

                      <p className="mt-7">後のタスク:</p>
                      <Select
                        showArrow
                        showSearch={false}
                        allowClear
                        mode="multiple"
                        placeholder="リレーション"
                      />

                    </Form.Item>

                    {/* Kōsū - effort */}
                    <Form.Item
                      label="工数"
                      name="effort"
                      required
                      rules={[
                        {
                          validator: numberInputValidator,
                        },
                      ]}
                    >
                      <Space className="space-items-special flex justify-between ">
                        <div className="w-1/2 max-w-xs flex-grow mb-1">
                          <Input
                            className="h-1/2"
                            style={{ padding: '6px', minWidth: '53px' }}
                            type="text"
                            size="large"
                            name="effort"
                            min={1}
                            value={numberInput}
                            onChange={autoConvertHalfwidth}

                          />
                        </div>
                        {/* ----------------- */}
                        <div className="w-100 flex flex-shrink  justify-center align-middle  flex-row w-100">
                          <Select
                            required
                            className="special-selector w-100 "
                            showArrow
                            showSearch={false}
                            placeholder="時間"
                            // options={options}
                          />
                          <p className="slash-devider text-3xl font-extrabold"> / </p>
                          <Select
                            required
                            className="special-selector"
                            showArrow
                            showSearch={false}
                            placeholder="学生数"
                          />
                        </div>
                      </Space>

                    </Form.Item>

                    {/* details    */}
                    <Form.Item
                      label="詳細"
                      name="detail"
                    >
                      <TextArea rows={7} placeholder="何かを入力してください" />
                    </Form.Item>

                    {/* 2 button */}
                    <Form.Item
                      label=" "
                      colon={false}
                      className="my-10"
                    >
                      <Space size={20} className="flex justify-end ">
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
                          style={{ letterSpacing: '-1px' }}
                        >
                          登録
                        </Button>
                      </Space>
                    </Form.Item>

                    {/* end form */}
                  </Form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </OtherLayout.Main>
    </OtherLayout>
  )
}

export default index
