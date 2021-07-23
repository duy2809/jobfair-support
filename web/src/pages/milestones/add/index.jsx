import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  notification,
  Row,
  Col,
} from 'antd'
import OtherLayout from '../../../layouts/OtherLayout'
import { addMilestone } from '../../../api/milestone'


export default function AddMilestonePage() {
  const [form] = Form.useForm()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisibleOfCancel, setIsModalVisibleOfCancel] = useState(false)
  const [typePeriodInput, setTypePeriodInput] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')

  const { Option } = Select

  const onValueNameChange = (e) => {
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  const onValueTimeChange = (e) => {
    form.setFieldsValue({
      time: toHalfWidth(e.target.value),
    })
  }

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '正常に保存されました。',

      style: {
        marginTop: '70px',
      },
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form.submit()
    setIsModalVisible(false)
    console.log(timeInput)
    addMilestone({
      name: nameInput,
      period: timeInput,
      is_week: typePeriodInput,
      schedule_id: 1,
    }).then(() => openNotificationSuccess())
      .catch((error) => {
        if (JSON.parse(error.response.request.response).errors.name[0] === 'The name has already been taken.') {
          notification.error({
            message: 'このマイルストーン名は存在しています',
          })
        }
        console.log(error.response)
      })
  }

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }
  const onValueTimeChange = (e) => {
    setTimeInput(e.target.value)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showModalOfCancel = () => {
    setIsModalVisibleOfCancel(true)
  }

  const handleCancelOfCancel = () => {
    setIsModalVisibleOfCancel(false)
  }

  const selectAfter = (
    <Form.Item name="typePeriod" noStyle>
      <Select
        className="select-after"
        onChange={(value) => {
        setTypePeriodInput(parseInt(value, 10))
      }}
      value={typePeriodInput.toString()}
        style={{
          width: 90,
        }}
      >
        <Option value="0">日後</Option>
        <Option value="1">週間後</Option>
      </Select>
    </Form.Item>
  )

  const onFinish = (values) => {
    console.log(values)
  }

  

  const blockInvalidChar = (e) => ['e', 'E', '+'].includes(e.key) && e.preventDefault()

  return (
    <>
      <OtherLayout>
        <OtherLayout.Main>
          <div className = "pt-10">
            <p className="ml-20 font-bold text-4xl">マイルストーン追加</p>
            <div className="pt-20">
              <Form
                form={form}
                name="addMilestone"
                onFinish={onFinish}
                initialValues={{
                  typePeriod: '0',
                }}
                size="large"
              >
                <Form.Item
                  label="マイルストーン名"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'この項目は必須です !',
                    },

                    {
                      validator(_, value) {
                        var specialCharRegex = new RegExp('[ 　]')
                        if (specialCharRegex.test(value)) {
                          return Promise.reject(new Error('マイルストーン名はスペースが含まれていません。'))
                        }

                        return Promise.resolve()
                      },
                    }
                  ]}
                  labelCol={{ span: 4, offset: 2 }}
                  wrapperCol={{ span: 9, offset: 2 }}
                >
                  <Input className="w-full" onChange={onValueNameChange} placeholder="マイルストーン名"/>
                </Form.Item>
                <Row className="pt-10 text-lg" gutter={8}>
                  <Col span={24}>
                    <Form.Item
                      label="期日"
                      name="time"
                      rules={[
                        {
                          required: true,
                          message: 'この項目は必須です !',
                        },

                        {
                          pattern: /^(?:\d*)$/,
                          message: '半角の整数で入力してください。',
                        },

                        /* {
                          validator(_, value) {
                            if (value < 0) {
                              return Promise.reject(
                                new Error('半角の整数で入力してください。'),
                              )
                            }
                            return Promise.resolve()
                          },
                        } */
                      ]}
                      labelCol={{ span: 4, offset: 2 }}
                      wrapperCol={{ span: 9, offset: 2 }}
                    >
                      <Input
                        /* type="number" */
                        type="text"
                        addonAfter={selectAfter}
                        onKeyDown={blockInvalidChar}
                        onChange={onValueTimeChange}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="pt-10">
                  <Col xs={{span: 2, offset: 10}} sm={{span: 2, offset: 6}} xl={{span: 2, offset: 12}}>
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={showModalOfCancel}
                      >
                        キャンセル
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col xs={{span: 2, offset:7}} sm={{span: 2, offset: 4}} xl={{span: 2, offset: 1}}>
                    <Form.Item shouldUpdate>
                      {() => (
                        <Button
                          type="primary"
                          disabled={
                            !(
                              form.isFieldTouched('name')
                              && form.isFieldTouched('time')
                            )
                            || !!form
                              .getFieldsError()
                              .filter(({ errors }) => errors.length).length
                          }
                          style={{width: '120px'}}
                          onClick={showModal}
                        >
                          保存
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Modal
                  title="マイルストーン追加"
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText="はい"
                  cancelText="いいえ"
                >
                  <p className="mb-5">追加してもよろしいですか </p>
                </Modal>
                <Modal
                  title="マイルストーン追加"
                  visible={isModalVisibleOfCancel}
                  onCancel={handleCancelOfCancel}
                  footer={[
                    <Button key="back" onClick={handleCancelOfCancel}>
                      いいえ
                    </Button>,
                    <Button key="submit" type="primary" href="../milestones">
                      はい
                    </Button>,
                  ]}
                >
                  <p className="mb-5">
                    追加内容が保存されません。よろしいですか？
                  </p>
                </Modal>
              </Form>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </>
  )
}
