import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons'
import {
  Button, Form,
  Input, Modal,
  // Spin,
  notification,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import addJFAPI from '../../api/add-jobfair'
import OtherLayout from '../../layouts/OtherLayout'
import * as Extensions from '../../utils/extensions'
// import useUnsavedChangesWarning from '../../components/load_more'
import './style.scss'

const index = () => {
  // page state.
  const [listAdminJF, setlistAdminJF] = useState([])
  const [listSchedule, setlistSchedule] = useState([])

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
  useEffect(() => {
    // Extensions.unSaveChangeConfirm(true)

    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const admins = await addJFAPI.getAdmin()
        const schedules = await addJFAPI.getSchedule()
        setlistAdminJF(Array.from(admins.data))
        setlistSchedule(Array.from(schedules.data))
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
    // get id (name) of the input that invoke this function
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
      const response = await addJFAPI.addJF(data)

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
  const onScheduleSelect = (_, event) => {
    const scheduleId = event.key
  }
  const checkIsJFNameExisted = async () => {
    const name = form.getFieldValue('name')
    const response = await addJFAPI.isJFExisted({ name })

    if (response.data) {
      return notification.open({
        icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
        duration: 3,
        message: 'このJF名は既に使用されています。',
        onClick: () => {},
      })
    }
    return false
  }

  /* Validator of all input. */
  const JFNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    // if (value) {
    //   if (checkIsJFNameExisted()) {
    //     return Promise.reject(new Error('JF名はすでに存在します'))
    //   }
    // }
    // check case when user type special characters

    if (value.match(Extensions.Reg.specialCharacter)) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }

    // if (value.match(Extensions.Reg.vietnamese)) {
    //   return Promise.reject(new Error('ベトナム語は入力できない'))
    // }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }

    return Promise.resolve()
  }

  const JFAdminValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    return Promise.resolve()
  }
  const JFScheduleValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }
  /* Validator of all input end */

  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="add-template-task-page">
          {/* JF名 戻る JF-スケジュール 管理者 開始日 参加企業社数  推定参加学生数 タスク一賜 マイルストーン一覧 */}
          <div className="container mx-auto flex-1 justify-center px-4  pb-20">
            {/* page title */}
            <h1 className="text-3xl">テンプレートタスク追加 </h1>
            <div>
              <div className="container mt-20">
                <Form
                  form={form}
                  labelCol={{
                    span: 6,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  layout="horizontal"
                  colon={false}
                  initialValues={{ defaultInputValue: 0 }}
                  onFinish={onFinishSuccess}
                  onFinishFailed={onFinishFailed}

                >
                  {/* template task name */}
                  <Form.Item
                    label="タスクテンプレート名"
                    name="name"
                    required
                    // hasFeedback
                    rules={[
                      {
                        validator: JFNameValidator,
                        validateTrigger: { checkIsJFNameExisted },
                      },

                    ]}
                  >
                    <Input
                      type="text"
                      name="JFName"
                      onBlur={checkIsJFNameExisted}
                      // onFocus={checkIsJFNameExisted}
                      placeholder="タスクテンプレート名を入力する"
                      maxLength={200}
                      // style={{ backgroundColor: '#e3f6f5' }}
                    />
                  </Form.Item>

                  {/* category */}
                  <Form.Item
                    required
                    // hasFeedback
                    label="カテゴリー"
                    name="jobfair_admin_id"
                    mode="multiple"
                    rules={[
                      {
                        validator: JFAdminValidator,
                      },
                    ]}
                  >
                    <Select mode="multiple" className="addJF-selector" placeholder="カテゴリー">
                      {listAdminJF.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* jobfair schedule */}
                  <Form.Item
                    required
                    // hasFeedback
                    name="schedule_id"
                    label="マイルストーン"
                    rules={[
                      {
                        validator: JFScheduleValidator,
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      className="addJF-selector"
                      placeholder="JF-スケジュールを選択"
                      onSelect={onScheduleSelect}
                    >
                      {listSchedule.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* 2 button */}
                  <Form.Item
                    label=" "
                    className="my-10"

                  >
                    <Space size={20} className="flex justify-end">
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
      </OtherLayout.Main>
    </OtherLayout>
  )
}

export default index
