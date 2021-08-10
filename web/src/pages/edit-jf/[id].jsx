import React, { useEffect, useState } from 'react'
import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons'
import { Button, DatePicker, Empty, Form, Input, List, Modal, notification, Select, Space } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import editApi from '../../api/edit-jobfair'
import { editJF } from '../../api/jf-toppage'
import OtherLayout from '../../layouts/OtherLayout'
import * as Extensions from '../../utils/extensions'
import './style.scss'

const index = () => {
  const dateFormat = 'YYYY/MM/DD'
  // page state.
  const [listAdminJF, setlistAdminJF] = useState([])
  const [listSchedule, setlistSchedule] = useState([])
  const [listMilestone, setlistMilestone] = useState([])
  const [listTask, setlistTask] = useState([])
  const [disableBtn, setdisableBtn] = useState(false)
  const [changeAdmin, setAdmin] = useState(false)
  const [changeScedule, setSchedule] = useState(false)
  const [AdminDF, setAdminDF] = useState('')
  const [SceduleDF, setScheduleDF] = useState('')
  const [form] = Form.useForm()
  const router = useRouter()
  const idJf = router.query.id
  // check if all input is empty.
  const checkIsFormInputEmpty = () => {
    const inputValues = form.getFieldsValue()
    const inputs = Object.values(inputValues)
    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (element) {
        return false
      }
    }
    return true
  }
  const getMilestone = async (id) => {
    const milestones = await editApi.getMilestone(id)
    if (milestones.data.milestones) {
      setlistMilestone(Array.from(milestones.data.milestones))
    }
  }
  const getTask = async (id) => {
    const tasks = await editApi.getTaskList(id)
    if (tasks.data.tasks) {
      setlistTask(Array.from(tasks.data.tasks))
    }
  }

  useEffect(() => {
    // Extensions.unSaveChangeConfirm(true)

    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const infoJF = await editApi.jfdata(idJf)
        const admins = await editApi.getAdmin()
        const schedules = await editApi.getSchedule()
        const jfSchedules = await editApi.ifSchedule(idJf)
        if (jfSchedules.data.data[0].id) {
          getMilestone(jfSchedules.data.data[0].id)
          getTask(jfSchedules.data.data[0].id)
        }
        setlistAdminJF(Array.from(admins.data))
        setlistSchedule(Array.from(schedules.data))
        setScheduleDF((jfSchedules.data.data[0].id).toString())
        setAdminDF((infoJF.data.user.id).toString())
        form.setFieldsValue({
          name: infoJF.data.name,
          start_date: moment(infoJF.data.start_date.split('-').join('/'), dateFormat),
          number_of_students: infoJF.data.number_of_students,
          number_of_companies: infoJF.data.number_of_companies,
          jobfair_admin_id: infoJF.data.user.name,
          schedule_id: jfSchedules.data.data[0].name,
        })
        // Extensions.unSaveChangeConfirm(true)
        return null
      } catch (error) {
        return Error(error.toString())
      }
    }
    fetchAPI()
  }, [])
  // onValueNameChange
  const onValueNameChange = (e) => {
    form.setFieldsValue({
      name: e.target.value,
    })
  }
  /* utilities function for support handle form */
  // reset form.
  const onFormReset = () => {
    form.resetFields()
    setlistMilestone([])
    setlistTask([])
  }

  const autoConvertHalfwidth = (event) => {
    setAdmin(false)
    const inputRef = event.target.id
    const dummyObject = {}
    dummyObject[inputRef] = Extensions.toHalfWidth(event.target.value)
    if (inputRef) {
      form.setFieldsValue(dummyObject)
    }
  }
  const routeTo = async (url) => {
    // await router.prefetch(url)
    // await router.push(url)

    router.prefetch(url)
    router.push(url)
  }

  /* Handle 2 form event when user click  キャンセル button or  登録 button */
  const onFinishFailed = (errorInfo) => errorInfo
  const cancelConfirmModle = () => {
    if (checkIsFormInputEmpty()) {
      routeTo('/jobfairs')
    } else {
      Modal.confirm({
        title: '変更内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        centered: true,
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
      message: '変更は正常に保存されました。',
      onClick: () => {},
    })
  }
  const onScheduleSelect = (_, event) => {
    setSchedule(true)
    const scheduleId = event.key

    getMilestone(scheduleId)
    getTask(scheduleId)
  }
  const adminSelect = () => {
    setAdmin(true)
  }
  // eslint-disable-next-line consistent-return
  const onFinishSuccess = async (values) => {
    try {
      Extensions.unSaveChangeConfirm(false)
      const data = {
        name: values.name.toString(),
        schedule_id: changeScedule ? values.schedule_id * 1.0 : SceduleDF,
        start_date: values.start_date.format(Extensions.dateFormat),
        number_of_students: values.number_of_students * 1.0,
        number_of_companies: values.number_of_companies * 1.0,
        jobfair_admin_id: changeAdmin ? values.jobfair_admin_id * 1.0 : AdminDF,
      }
      setdisableBtn(true)
      await editJF(idJf, data).then((response) => {
        console.log(response)
        saveNotification()
        routeTo(`/jf-toppage/${idJf}`)
      }).catch((error) => {
        console.log(error)
        setdisableBtn(false)
      })
    } catch (error) {
      setdisableBtn(false)
      const isDuplicate = JSON.parse(error.request.response).message
      if (isDuplicate.toLocaleLowerCase().includes('duplicate')) {
        notification.open({
          icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
          message: 'このJF名は既に使用されています。',
          onClick: () => {},
        })
      } else {
        notification.open({
          icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
          message: '保存に失敗しました。',
          onClick: () => {},
        })
      }
      return error
    }
  }
  /* Validator of all input. */
  const companiesJoinValidator = (_, value) => {
    // if (!value) {
    //   return Promise.reject(new Error('この項目は必須です'))
    // }
    // if (value < 0) {
    //   return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    // }
    // // check case when user set number of company that join JF smaller than 1
    // if (Extensions.isFullWidth(value)) {

    //   // return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    // }
    // // setinputTest(Extention.toHalfWidth(value.toString()))
    // if (!value.match(Extensions.Reg.onlyNumber)) {
    //   return Promise.reject(new Error('使用できない文字が含まれています。'))
    // }
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value * 1.0 < 1) {
      return Promise.reject(new Error('1以上の整数で入力してください。'))
    }
    return Promise.resolve()
  }
  const studentsJoinValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value * 1.0 < 1) {
      return Promise.reject(new Error('1以上の整数で入力してください。'))
    }
    // if (!value.match(Extensions.Reg.onlyNumber)) {
    //   return Promise.reject(new Error('使用できない文字が含まれています。'))
    // }

    // if (Extensions.isFullWidth(value)) {
    //   return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    // }

    return Promise.resolve()
  }
  const JFNameValidator = (_, value) => {
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

  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
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
        <div className="edit__jf">
          {/* JF名 戻る JF-スケジュール 管理者 開始日 参加企業社数  推定参加学生数 タスク一賜 マイルストーン一覧 */}
          <div className="container mx-auto flex-1 justify-center px-4  pb-20">
            {/* page title */}
            <h1 className="text-3xl">JF 編集 </h1>
            <div>
              <div className="container">
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
                  {/* jobfair name */}
                  <Form.Item
                    label="JF名"
                    name="name"
                    rules={[
                      {
                        validator: JFNameValidator,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="JF名入力する"
                      maxLength={20}
                      onChange={onValueNameChange}
                    />
                  </Form.Item>

                  {/* start date */}
                  <Form.Item
                    name="start_date"
                    label="開始日"
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      help="Please select the correct date"
                      // style={{ backgroundColor: '#e3f6f5' }}
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}

                    // disable date in the past
                    // disabledDate={(current) => {
                    //   return current < moment();
                    // }}
                    />
                  </Form.Item>
                  {/* number of companies */}
                  <Form.Item
                    label="参加企業社数"
                    name="number_of_companies"
                    rules={[
                      {
                        validator: companiesJoinValidator,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      size="large"
                      min={1}
                      onChange={autoConvertHalfwidth}
                      style={{ width: '130px' }}
                      placeholder="参加企業社数"
                    />
                  </Form.Item>

                  {/* number of students */}
                  <Form.Item
                    name="number_of_students"
                    label="推定参加学生数"
                    rules={[
                      {
                        validator: studentsJoinValidator,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      size="large"
                      min={1}
                      onChange={autoConvertHalfwidth}
                      style={{ width: '130px' }}
                      placeholder="推定参加学生数"
                    />
                  </Form.Item>

                  {/* jobfair admin */}
                  <Form.Item
                    label="管理者"
                    name="jobfair_admin_id"
                    onSelect={adminSelect}
                    rules={[
                      {
                        validator: JFAdminValidator,
                      },
                    ]}
                  >
                    <Select className="addJF-selector" placeholder="管理者を選択">
                      {listAdminJF.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* jobfair schedule */}
                  <Form.Item
                    name="schedule_id"
                    label="JF-スケジュール"
                    rules={[
                      {
                        validator: JFScheduleValidator,
                      },
                    ]}
                  >
                    <Select
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

                  {/* list milestones */}
                  <Form.Item label=" ">
                    マイルストーン一覧
                    <List
                      className="demo-infinite-container"
                      bordered
                      locale={
                        { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="該当結果が見つかりませんでした" /> }
                      }
                      // style={{ backgroundColor: '#e3f6f5' }}
                      size="small"
                      dataSource={listMilestone}
                      renderItem={(item) => (
                        <List.Item className="list-items" key={item.id}>
                          {item.name}
                        </List.Item>
                      )}
                    />
                  </Form.Item>

                  {/* list task */}
                  <Form.Item label=" ">
                    タスク一賜
                    <List
                      className="demo-infinite-container"
                      bordered
                      // style={{ backgroundColor: '#e3f6f5' }}
                      size="small"
                      locale={
                        { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="該当結果が見つかりませんでした" /> }
                      }
                      dataSource={listTask}
                      renderItem={(item) => (
                        <List.Item className="list-items" key={item.id}>
                          {item.name}
                        </List.Item>
                      )}
                    />
                  </Form.Item>

                  {/* 2 button */}
                  <Form.Item
                    label=" "
                    className="my-10 "
                  >
                    <Space size={30} className="flex justify-end">
                      <Button
                        htmlType="button"
                        type="primary"
                        onClick={cancelConfirmModle}
                        disabled={disableBtn}
                        className="button_cacel"
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={disableBtn}
                        loading={disableBtn}
                      >
                        保存
                      </Button>
                    </Space>
                  </Form.Item>
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