import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import addJFAPI from '../../api/edit-jf'
import OtherLayout from '../../layouts/OtherLayout'
import * as Extention from '../../utils/extentions'
import './style.scss'

const index = () => {
  // page state.
  const [listAdminJF, setlistAdminJF] = useState([])
  const [listSchedule, setlistSchedule] = useState([])
  const [listMilestone, setlistMilestone] = useState([])
  const [listTask, setlistTask] = useState([])
  const [disableBtn, setdisableBtn] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const admins = await addJFAPI.getAdmin()
        const schedules = await addJFAPI.getSchedule()
        setlistAdminJF(Array.from(admins.data))
        setlistSchedule(Array.from(schedules.data))
        return null
      } catch (error) {
        return Error(error.toString())
      }
    }
    fetchAPI()
  }, [])

  /* Handle 2 form event when user click  キャンセル button or  登録 button */
  const onFinishFailed = (errorInfo) => errorInfo

  /* open success notification to user */
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      message: '正常に登録されました。',
      onClick: () => {},
    })
  }

  // handle user click add job fair.
  const onFinishSuccess = async (values) => {
    try {
      const data = {
        name: values.name.toString(),
        schedule_id: values.schedule_id * 1.0,
        start_date: values.start_date.format(Extention.dateFormat),
        number_of_students: values.number_of_students * 1.0,
        number_of_companies: values.number_of_companies * 1.0,
        jobfair_admin_id: values.jobfair_admin_id * 1.0,
      }

      await addJFAPI.addJF(data)
      setdisableBtn(true)
      saveNotification()
      router.push(`/jf-toppage/${values.schedule_id * 1.0}`)
      return null
    } catch (error) {
      return error
    }
  }
  // reset form.
  const onFormReset = () => {
    form.resetFields()
    setlistMilestone([])
    setlistTask([])
  }
  // const onChange = (value) => {}
  // call api get milestone  when selector change schedule.
  const getMilestone = async (id) => {
    const milestones = await addJFAPI.getMilestone(id)
    if (milestones.data.milestones) {
      setlistMilestone(Array.from(milestones.data.milestones))
    }
  }

  // call api get milestone  when selector change schedule
  const getTask = async (id) => {
    const tasks = await addJFAPI.getTaskList(id)
    if (tasks.data.tasks) {
      setlistTask(Array.from(tasks.data.tasks))
    }
  }

  // handle when ever selector change.
  const onScheduleSelect = (_, event) => {
    const scheduleId = event.key

    getMilestone(scheduleId)
    getTask(scheduleId)
  }

  // check if all input is empty
  const checkIsFormInputEmpty = () => {
    const inputValues = form.getFieldsValue()
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (element) {
        return false
      }
    }
    // for (const key in inputValues) {
    //   if (inputValues[key]) return false
    // }
    return true
  }
  /* handle modal or popup to notifiy to user */
  const cancelConfirmModle = () => {
    if (checkIsFormInputEmpty()) {
      router.push('/JF-List')
    } else {
      Modal.confirm({
        title: '入力内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          onFormReset()
          router.push('/JF-List')
        },
        onCancel: () => {},
        okText: 'はい',
        cancelText: 'いいえ',
      })
    }
  }

  /* Validator of all input  */
  const JFNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    // check case when user type special characters
    if (
      value.match(/^[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]*$/)
      || value.match(/[0-9]/)
    ) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }

    return Promise.resolve()
  }
  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    // if (value.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]*$/)) {
    //   return Promise.reject(new Error("使用できない文字が含まれています"));
    // }
    return Promise.resolve()
  }
  const companiesJoinValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    // check case when user set number of company that join JF smaller than 1
    if (Extention.isFullWidth(value)) {
      return Promise.reject(new Error('半角の整数で入力してください。'))
    }
    if (!value.match(/^[0-9]*$/)) {
      return Promise.reject(new Error('使用できない文字が含まれています。'))
    }

    return Promise.resolve()
  }
  const studentsJoinValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    if (!value.match(/^[0-9]*$/)) {
      return Promise.reject(new Error('使用できない文字が含まれています。'))
    }

    if (Extention.isFullWidth(value)) {
      return Promise.reject(new Error('半角の整数で入力してください。'))
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

  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="addJF-page">
          {/* JF名 戻る JF-スケジュール 管理者 開始日 参加企業社数  推定参加学生数 タスク一賜 マイルストーン一覧 */}
          <div className="container mx-auto flex-1 justify-start m-8 px-4 pt-7 pb-20">
            {/* page title */}
            <h1 className="text-3xl">JF追加 </h1>
            <div className="container pr-32 relative top-7">
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
                    style={{ backgroundColor: '#e3f6f5' }}
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
                    style={{ backgroundColor: '#e3f6f5' }}
                    format={Extention.dateFormat}
                    placeholder={Extention.dateFormat}

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
                    style={{ width: '130px' }}
                    placeholder="推定参加学生数"
                  />
                </Form.Item>

                {/* jobfair admin */}
                <Form.Item
                  label="管理者"
                  name="jobfair_admin_id"
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
                    style={{ backgroundColor: '#e3f6f5' }}
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
                    style={{ backgroundColor: '#e3f6f5' }}
                    size="small"
                    dataSource={listTask}
                    renderItem={(item) => (
                      <List.Item className="list-items" key={item.id}>
                        {item.name}
                      </List.Item>
                    )}
                  />
                </Form.Item>

                {/* 2 button */}
                <Form.Item label=" " className="my-10">
                  <Space size={100}>
                    <Button
                      htmlType="button"
                      onClick={cancelConfirmModle}
                      style={{
                        color: '#000000',
                        // border: "1px solid black",
                      }}
                    >
                      キャンセル
                    </Button>

                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disableBtn}
                      loading={disableBtn}
                      style={{
                        backgroundColor: '#e3f6f5',
                        color: '#000000',
                        border: '1px solid black',
                      }}
                      // onClick={this.disable}
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
      </OtherLayout.Main>
    </OtherLayout>
  )
}

export default index
