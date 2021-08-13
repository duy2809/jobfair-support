import React, { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button, Modal, notification, Select, Space } from 'antd'
import { useRouter } from 'next/router'
import OtherLayout from '../../../layouts/OtherLayout'
import 'antd/dist/antd.css'
import './styles.scss'
import { sendInviteLink } from '~/api/member'

function InviteMember() {
  const [emailInput, setEmailInput] = useState('')
  const [roleInput, setRoleInput] = useState('')
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
  const children = []
  children.push(<Option key="2">JF管理者</Option>)
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

  const isEmptyForm = () => {
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

  const handleModal = () => {
    if (isEmptyForm()) {
      router.push('/member')
    } else {
      return Modal.confirm({
        title: '変更は保存されていません。続行してもよろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          router.push('/member')
        },
        onCancel: () => {},
        centered: true,
        okText: 'はい',
        cancelText: 'いいえ',
      })
    }
    return null
  }

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 2.5,
    })
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
        openNotification(
          'success',
          'ご登録のメールアドレスに招待メールを送信しました。',
        )
      }
    } catch (error) {
      if (error.request.status === 400) {
        document.getElementById('errorEmail').removeAttribute('hidden')
      }
    }
  }
  return (
    <OtherLayout>
      <OtherLayout.Main>
        <h1>メンバ招待</h1>
        <div className="invite-member-page">
          <div className="container mx-auto flex-1 justify-center px-4 pb-20">
            <div className="flex justify-center">
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
                className="invite-member-form"
                onFinish={handleInvite}
                validateMessages={validateMessages}
              >
                <Form.Item label="メールアドレス" colon required>
                  <Form.Item
                    name="email"
                    label="メールアドレス"
                    noStyle
                    rules={[
                      { required: true },
                      {
                        type: 'email',
                        message: 'メールアドレス有効なメールではありません!',
                      },
                    ]}
                  >
                    <Input
                      name="email"
                      className="py-2"
                      size="large"
                      onChange={onValueEmailChange}
                      type="email"
                      placeholder="email@example.com"
                      initialValues={emailInput}
                    />
                  </Form.Item>
                  <span id="errorEmail" hidden>
                    このメールは既に存在しました
                  </span>
                </Form.Item>
                <Form.Item
                  name="categories"
                  label="役割"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  colon
                >
                  <Select
                    showSearch
                    mode="tag"
                    className="ant-select"
                    placeholder="役割を選んでください"
                    size="large"
                    onChange={onValueRoleChange}
                    initialValues={roleInput}
                  >
                    {children}
                  </Select>
                </Form.Item>

                <Form.Item label=" " className="my-10">
                  <Space size={20} className="flex justify-end">
                    <Button
                      className="ant-btn mr-3"
                      id="btn-cancel"
                      htmlType="button"
                      enabled="true"
                      onClick={handleModal}
                    >
                      キャンセル
                    </Button>
                    <Button
                      id="btn-submit"
                      type="primary"
                      htmlType="submit"
                      enabled
                    >
                      招待
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </OtherLayout.Main>
    </OtherLayout>
  )
}

InviteMember.middleware = ['auth:superadmin']
export default InviteMember
