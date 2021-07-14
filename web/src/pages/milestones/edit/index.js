import React,  { useState } from 'react'
import { Form, Input, Button, Modal, notification } from 'antd'
import CancelEdit from '../../../components/CancelEdit'


const  EditMilestones = () => {
  
  const [nameInput, setNameInput] = useState('')
  const openNotificationSuccess = () => {
    notification.success({
      message: 'メールが送信されました。',
      description: 'メールを確認してください。',
    })
  }
  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }

  

  return (
    <div className="h-screen flex flex-col items-center pt-10 bg-white edit_milestones space-y-9">
    <nav>NAV BAR</nav>
      <p className="text-4xl my-12 font-medium">マイルストーン編集</p>
      <Form
        name="basic"
        className="w-96 space-y-12"
        initialValues={{
          remember: true,
        }}
        
      >
        <Form.Item
          label="マイルストーン名"
          name="milestone_name"
          rules={[{ required: true, message: '必須項目で入力されていない項目があります' }]}
          
        >
          <Input
            type="text"
            onChange={onValueNameChange}
            placeholder="マイルストーン名"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between ">
            <CancelEdit></CancelEdit>
              
            {nameInput !== ''  ? (
              <Button
                type="primary"
                htmlType="submit"
                className="text-base "
                style={{'backgroundColor': '#bae8e8', 'borderColor':'#bae8e8' }}
                
              >
                保存
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className="text-base"
                disabled
              >
                保存
              </Button>
            )}
            
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditMilestones
