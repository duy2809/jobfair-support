/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useEffect, useState } from 'react'
import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
  Space,
} from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import editApi from '../../api/edit-jobfair'
import { editJF } from '../../api/jf-toppage'
import Loading from '~/components/loading'
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
  const [disableBtn, setDisableBtn] = useState(false)
  const [changeAdmin, setAdmin] = useState(false)
  const [changeScedule, setSchedule] = useState(false)
  const [AdminDF, setAdminDF] = useState('')
  const [SceduleDF, setScheduleDF] = useState('')
  const [form] = Form.useForm()
  const router = useRouter()
  const idJf = router.query.id
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(true)

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
  const getTask = async (name) => {
    const listSchedules = await editApi.getSchedulesTaskByName(name)
    const scheduleID = listSchedules.data.find((schedule) => schedule.jobfair_id == null).id
    // console.log(scheduleID)
    const schedule = await editApi.getTaskList(scheduleID)
    const taskList = schedule.data.template_tasks.map((task) => task.name)
    if (taskList) {
      setlistTask(Array.from(taskList))
    }
  }

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const infoJF = await editApi.jfdata(idJf)
        const admins = await editApi.getAdmin()
        const schedules = await editApi.getSchedule()
        const jfSchedules = await editApi.ifSchedule(idJf)
        if (jfSchedules.data.data[0].id) {
          getMilestone(jfSchedules.data.data[0].id)
          getTask(jfSchedules.data.data[0].name)
          // getTask(idJf)
        }
        setlistAdminJF(Array.from(admins.data))
        setlistSchedule(Array.from(schedules.data))
        setScheduleDF(jfSchedules.data.data[0].id.toString())
        setAdminDF(infoJF.data.user.id.toString())
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
    setLoading(false)
  }, [])
  // onValueNameChange
  const onValueNameChange = (e) => {
    setIsEdit(true)
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
    setIsEdit(true)
    setAdmin(false)
    const inputRef = event.target.id
    const dummyObject = {}
    dummyObject[inputRef] = Extensions.toHalfWidth(event.target.value)
    if (inputRef) {
      form.setFieldsValue(dummyObject)
    }
  }
  /* Handle 2 form event when user click  キャンセル button or  登録 button */
  const onFinishFailed = (errorInfo) => errorInfo
  const cancelConfirmModle = () => {
    if (checkIsFormInputEmpty() || isEdit === false) {
      router.push('/jobfairs')
    } else {
      Modal.confirm({
        title: '変更内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        centered: true,
        onOk: () => {
          onFormReset()
          router.push('/jobfairs')
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
      duration: 3,
      onClick: () => {},
    })
  }
  const onScheduleSelect = (_, event) => {
    setIsEdit(true)
    setSchedule(true)
    const scheduleId = event.key
    const scheduleName = event.children

    getMilestone(scheduleId)
    getTask(scheduleName)
  }
  const adminSelect = () => {
    setIsEdit(true)
    setAdmin(true)
  }
  // eslint-disable-next-line consistent-return
  const onFinishSuccess = async (values) => {
    setLoading(true)
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
      setDisableBtn(true)
      await editJF(idJf, data)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false)
            router.push(`/jf-toppage/${idJf}`)
            saveNotification()
          }
        })
        .catch(() => {
          setDisableBtn(false)
        })
    } catch (error) {
      setLoading(false)
      setDisableBtn(false)
      const isDuplicate = JSON.parse(error.request.response).message
      if (isDuplicate.toLocaleLowerCase().includes('duplicate')) {
        notification.open({
          icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
          message: 'このJF名は既に使用されています。',
          duration: 3,
          onClick: () => {},
        })
      } else {
        notification.open({
          icon: <ExclamationCircleTwoTone twoToneColor="#BB371A" />,
          message: '保存に失敗しました。',
          duration: 3,
          onClick: () => {},
        })
      }
      return error
    }
  }
  const companiesJoinValidator = (_, value) => {
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
    return Promise.resolve()
  }
  const JFNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
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

  return (
    <div>
      <Loading loading={loading} overlay={loading} />
      <OtherLayout>
        <OtherLayout.Main>
          <h1>JF 編集 </h1>
          <div className="edit__jf">
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
              onFinish={onFinishSuccess}
              onFinishFailed={onFinishFailed}
            >
              <div className="grid grid-cols-2 mx-10">
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label={<p className="font-bold">JF名</p>}
                    name="name"
                    rules={[
                      {
                        validator: JFNameValidator,
                        required: true,
                      },
                    ]}
                  >
                    <Input type="text" placeholder="JF名入力する" onChange={onValueNameChange} />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="start_date"
                    label={<p className="font-bold">開始日</p>}
                    rules={[
                      {
                        validator: startDayValidator,
                        required: true,
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
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label={<p className="font-bold">参加企業社数</p>}
                    name="number_of_companies"
                    rules={[
                      {
                        validator: companiesJoinValidator,
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      size="large"
                      min={1}
                      onChange={autoConvertHalfwidth}
                      // style={{ width: '130px' }}
                      placeholder="参加企業社数"
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="number_of_students"
                    label={<p className="font-bold">推定参加学生数</p>}
                    rules={[
                      {
                        validator: studentsJoinValidator,
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      size="large"
                      min={1}
                      onChange={autoConvertHalfwidth}
                      // style={{ width: '130px' }}
                      placeholder="推定参加学生数"
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label={<p className="font-bold">管理者</p>}
                    name="jobfair_admin_id"
                    onSelect={adminSelect}
                    rules={[
                      {
                        validator: JFAdminValidator,
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      className="addJF-selector"
                      placeholder="管理者を選択"
                    >
                      {listAdminJF.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="schedule_id"
                    label={<p className="font-bold">JFスケジュール</p>}
                    rules={[
                      {
                        validator: JFScheduleValidator,
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      className="addJF-selector"
                      placeholder="JF-スケジュールを選択"
                      onSelect={onScheduleSelect}
                      size="large"
                    >
                      {listSchedule.map((element) => (
                        <Select.Option key={element.id} value={element.id}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item label=" ">
                    <p className="font-bold">マイルストーン一覧</p>
                    <List
                      className="demo-infinite-container"
                      bordered
                      locale={{
                        emptyText: (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="該当結果が見つかりませんでした"
                          />
                        ),
                      }}
                      style={{ height: 250, overflow: 'auto' }}
                      size="small"
                      dataSource={listMilestone}
                      renderItem={(item) => (
                        <List.Item className="list-items" key={item.id}>
                          {item.name}
                        </List.Item>
                      )}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item label=" ">
                    <p className="font-bold">タスク一覧</p>
                    <List
                      className="demo-infinite-container"
                      bordered
                      style={{ height: 250, overflow: 'auto' }}
                      size="small"
                      locale={{
                        emptyText: (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="該当結果が見つかりませんでした"
                          />
                        ),
                      }}
                      dataSource={listTask}
                      renderItem={(item) => (
                        <List.Item className="list-items" key={item.id}>
                          {item}
                        </List.Item>
                      )}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex justify-end -mr-5">
                <Form.Item label=" " className=" mr-8 mt-4">
                  <Space size={12}>
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
                      className="mr-20"
                    >
                      <span> 保存 </span>
                    </Button>
                  </Space>
                </Form.Item>
              </div>
            </Form>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
index.middleware = ['auth:superadmin']
export default index
