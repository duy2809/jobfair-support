import React, { useState } from 'react'
import { Form, Input, Button, Select, Modal, notification } from 'antd'
import NavBar from './../../../../components/navbar'
import CancelEditMilestone from './../../../../components/CancelEditMilestone'
import { useRouter } from "next/router"
import './styles.scss'
const LoginPage = () => {
    const {query} = useRouter()
    // {query['id']}
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const { Option } = Select;
  

  const openNotificationSuccess = () => {
    notification.success({
      message: 'メールが送信されました。',
      description: 'メールを確認してください。',
    })
  }

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }
  const onValueTimeChange = (e) => {
    setTimeInput(e.target.value)
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

  const selectAfter = (
    <Select defaultValue="日後" className="select-after">
      <Option value="日後">日後</Option>
      <Option value="週間後">週間後</Option>
      
    </Select>
  );

  return (
        <div>
            <NavBar></NavBar>
            <div className="h-screen flex flex-col items-center pt-10 bg-white ">
            
            <p className="text-4xl my-12">マイルストーン編集</p>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 12,
                }}
                // initialValues={{
                //     remember: true,
                // }}
                className="space-y-12 w-1/2 justify-items-center"
                
            >
                <Form.Item
                    label="マイルストーン名"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '必須項目で入力されていない項目があります。'
                        },
                    ]}
                    >
                    <Input
                        type="text"
                        onChange={onValueNameChange}
                        placeholder="マイルストーン名"
                    />
                </Form.Item>

                <Form.Item
                    label="期日"
                    name="time"
                    rules={[
                        {
                    
                            required: true,
                            message: '必須項目で入力されていない項目があります。',
                            

                        },
                        {
                            pattern: /^(?:\d*)$/,
                            message: "数字を入力してください",
                        },
                        () => ({
                            validator(_, value) {
                               
                                if (value > 5) {
                                return Promise.reject("Zip code can't be more than 5 ");
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                    >
                     <Input addonAfter={selectAfter} defaultValue="" onChange={onValueTimeChange} />
                </Form.Item>

                <Modal
                    title="ログインパスワード変更"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    cancelText="キャンセル"
                    >
                    <p className="mb-5">メールアドレス: </p>
                </Modal>

            
                <Form.Item
                    className=" justify-center "
                >
                <div className="flex justify-between my-10 ">
                    <CancelEditMilestone></CancelEditMilestone>

                    {(nameInput !== '' && timeInput !== '' && timeInput <=5  )? (
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="text-base px-14"
                        onClick={showModal}
                    >
                        保存
                    </Button>
                    ) : (
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="text-base px-14"
                        disabled
                    >
                        保存
                    </Button>
                    )}
                </div>
                </Form.Item>
            </Form>
            </div>
        </div>
     

          
  )
}

export default LoginPage
