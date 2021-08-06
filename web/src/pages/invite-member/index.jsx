import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Modal, notification, Select } from 'antd'
import { useRouter } from 'next/router'
import OtherLayout from '../../layouts/OtherLayout'
import 'antd/dist/antd.css'
import './styles.scss'
import { sendInviteLink } from '~/api/member'

export default function InviteMember() {
  const [emailInput, setEmailInput] = useState('')
  const [roleInput, setRoleInput] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})

  // Disable button when reload page
  useEffect(() => {
    forceUpdate({})
  }, [])

  const onValueEmailChange = (e) => {
    document.getElementById('errorEmail').setAttribute('hidden', true)
    setEmailInput(e.target.value)
  }
  const onValueRoleChange = (value) => {
    setRoleInput(value)
  }
  const { Option } = Select
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 28,
    },
  }
  const children = []
  children.push(<Option key="2">管理者</Option>)
  children.push(<Option key="3">メンバ</Option>)

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label}を入力してください。',
    types: {
      email: '',
    },
    email: {
      message: '${message}',
    },
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleClick = () => {
    router.push('/memberdetail')
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 2.5,
    })
  }
  const onFinishFailed = (errorInfo) => {
    openNotification('error', errorInfo)
  }

  const handleInvite = async () => {
    const email = form.getFieldValue('email')
    const role = form.getFieldValue('categories')
    try {
      const response = await sendInviteLink({ email, role })
      if (response.request.status === 200) {
        form.resetFields()
        setEmailInput('')
        setRoleInput('')
        openNotification('success', 'ご登録のメールアドレスに招待メールを送信しました。')
      }
    } catch (error) {
      if (error.request.status === 400) {
        document.getElementById('errorEmail').removeAttribute('hidden')
        // openNotification(
        //   'error',
        //   'このメールは既に存在しました',
        // )
      }
    }
  }

  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="flex flex-col h-full items-center justify-center ">
          <div className="screen-name text-6xl w-11/12  py-10 ">メンバ招待</div>
          <div className=" justify-items-center w-6/12 rounded-2xl border-2 border-black">
            <Form
              className="text-2xl m-auto w-full "
              {...layout}
              form={form}
              onFinish={handleInvite}
              onFinishFailed={onFinishFailed}
              validateMessages={validateMessages}
            >
              <Form.Item>
                <Form.Item
                  name="email"
                  label="メールアドレス"
                  rules={[
                    { required: true }, { type: 'email', message: 'メールアドレス有効なメールではありません!' },
                  ]}
                >
                  <Input
                    size="large"
                    onChange={onValueEmailChange}
                    types="email"
                    initialValues={emailInput}
                  />
                </Form.Item>
                <span id="errorEmail" hidden style={{ color: 'red'}}>このメールは既に存在しました</span>
              </Form.Item>
              <Form.Item
                name="categories"
                label="役割"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  mode="tag"
                  style={{ width: '100%' }}
                  placeholder="カテゴリを選んでください"
                  size="large"
                  onChange={onValueRoleChange}
                  initialValues={roleInput}
                >
                  {children}
                </Select>
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <div className="flex justify-center items-center w-10/12 ">
                  <div className="flex ml-5">
                    <Modal
                      centered="true"
                      visible={isModalVisible}
                      onCancel={handleCancel}
                      onOk={handleClick}
                      width={600}
                      okText="はい"
                      cancelText="いいえ"
                    >
                      <p className="mb-5">変更は保存されていません。続行してもよろしいですか？ </p>
                    </Modal>
                    <Button
                      id="btn-cancel"
                      size="large"
                      className="ml-9 text-base px-14 w-32"
                      type="primary"
                      htmlType="submit"
                      enabled="true"
                      onClick={showModal}
                    >
                      キャンセル
                    </Button>
                  </div>
                  <div>
                    <Form.Item shouldUpdate>
                      {() => (
                        <div className="flex justify-center">
                          <Button
                            id="btn-submit"
                            type="primary"
                            htmlType="submit"
                            className="text-base px-14"
                            disabled={
                              !!form
                                .getFieldsError()
                                .filter(({ errors }) => errors.length).length
                              || !(
                                form.isFieldTouched('email')
                                && form.isFieldTouched('categories'))
                            }
                          >
                            招待
                          </Button>
                        </div>
                      )}
                    </Form.Item>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </OtherLayout.Main>
    </OtherLayout>
  )
}
