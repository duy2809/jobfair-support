import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Modal, notification } from 'antd'

const LoginPage = () => {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openNotificationSuccess = () => {
    notification.success({
      message: 'メールが送信されました。',
      description: 'メールを確認してください。',
    })
  }

  // const onFinish = (values) => {
  //   console.log('Success:', values);
  // };

  // const onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  const onValueEmailChange = (e) => {
    setEmailInput(e.target.value)
  }

  const onValuePasswordChange = (e) => {
    setPasswordInput(e.target.value)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    openNotificationSuccess()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className="h-screen flex flex-col items-center pt-10 bg-white">
      <img src="./logo.png" className="w-24" alt="logo" />
      <p className="text-3xl my-8">Jobfair サポート</p>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        layout="vertical"
        className="w-96"
      >
        <Form.Item
          label="メールアドレス"
          name="email"
          rules={[
            {
              type: 'email',
              message: 'メールアドレスもしくはパスワードが異なります。',
            },
          ]}
        >
          <Input
            type="email"
            onChange={onValueEmailChange}
            placeholder="メールアドレスを入力してください。"
          />
        </Form.Item>

        <Form.Item label="パスワード" name="password">
          <Input.Password
            onChange={onValuePasswordChange}
            placeholder="パスワードを入力してください。"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <div className="flex justify-between">
            <Checkbox>ログイン状態を保持する</Checkbox>
            <a className="text-blue-600" onClick={showModal}>
              パスワードをお忘れの方
            </a>
          </div>
        </Form.Item>

        <Modal
          title="ログインパスワード変更"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText="キャンセル"
        >
          <p className="mb-5">メールアドレス: </p>
          <Input
            type="email"
            placeholder="メールアドレスを入力してください。"
            defaultValue={emailInput}
          />
        </Modal>

        <Form.Item>
          <div className="flex justify-center">
            {emailInput !== '' && passwordInput !== '' ? (
              <Button
                type="primary"
                htmlType="submit"
                className="text-base px-14"
                href="/top"
              >
                ログイン
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className="text-base px-14"
                disabled
              >
                ログイン
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginPage
