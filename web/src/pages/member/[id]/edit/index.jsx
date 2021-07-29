import React, { useState } from 'react'
import { Form, Input, Button, Popconfirm, notification, Select } from 'antd'
import { useRouter } from 'next/router'
import Layout from '../../../../layouts/OtherLayout'
import 'antd/dist/antd.css'
import './styles.scss'

const EditMember = () => {
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter()

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }
  const onValueEmailChange = (e) => {
    setEmailInput(e.target.value)
  }
  const { Option } = Select
  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 28,
    },
  }
  const children = []
  for (let i = 10; i < 36; i += 1) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '正常に更新されました',
    })
  }
  const handleOk = () => {
    setIsModalVisible(false)
    openNotificationSuccess()
    router.push('/memberdetail')
  }

  const handleCancel = () => {
    isModalVisible(false)
    setIsModalVisible(false)
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push('/memberdetail')
  }

  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="text-6xl w-10/12 font-bold py-10 ">メンバ編集</div>
          <Form className="text-2xl py-10 mb-48 w-3/5" {...layout}>
            <Form.Item
              name="member"
              label="フルネーム"
              rules={[
                {
                  message: 'フルネーム必要とされている!',
                  required: true,
                },
              ]}
            >
              <Input
                size="large"
                onChange={onValueNameChange}
                type="name"
                defaultValue={nameInput}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="メールアドレス"
              rules={[
                {
                  type: 'email',
                  message: 'メールアドレス有効なメールではありません! ',
                  required: true,
                },
              ]}
            >
              <Input
                size="large"
                onChange={onValueEmailChange}
                type="email"
                defaultValue={emailInput}
              />
            </Form.Item>
            <Form.Item
              name={['user', 'category']}
              label="カテゴリ"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" size="large">
                {children}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <div className="flex justify-center w-10/12 ">
                <div className="flex ml-5">
                  <Popconfirm
                    title="変更は保存されていません。続行してもよろしいですか？"
                    onConfirm={handleClick}
                    onCancel={handleCancel}
                    width={600}
                    okText="OK"
                    cancelText="キャンセル"
                  >
                    <Button
                      size="large"
                      className="ml-9 text-base px-14 w-32"
                      type="primary"
                      htmlType="submit"
                      enabled="true"
                    >
                      キャンセル
                    </Button>
                  </Popconfirm>
                </div>
                <div>
                  <Button
                    size="large"
                    className="ml-9 text-base px-14 w-32"
                    type="primary"
                    htmlType="submit"
                    enabled="true"
                    onClick={nameInput !== '' && emailInput !== '' ? handleOk : handleCancel}
                  >
                    保存
                  </Button>
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Layout.Main>
    </Layout>
  )
}

export default EditMember
