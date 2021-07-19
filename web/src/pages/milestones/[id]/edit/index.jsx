import React, { useState } from 'react'
import { Form, Input, Button, Select, Modal, notification } from 'antd'
// import { useRouter } from 'next/router'
import CancelEditMilestone from '../../../../components/CancelEditMilestone'
import OtherLayout from '../../../../layouts/OtherLayout'

import './styles.scss'

const LoginPage = () => {
//   const { query } = useRouter()
  // {query['id']}
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [checkSpace, setcheckSpace] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const { Option } = Select

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',

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
  )
  const specialCharRegex = new RegExp('[ 　]')

  const blockInvalidChar = (e) => ['e', 'E', '+'].includes(e.key) && e.preventDefault()

  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>

          <p className="text-4xl ">マイルストーン編集</p>

          <div className="h-screen flex flex-col items-center pt-10 bg-white ">

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
                    message: 'この項目は必須です。',
                  },
                  // {
                  //     whitespace: true,
                  //     message: 'no space。',

                  // },
                  () => ({
                    validator(_, value) {
                      if (specialCharRegex.test(value)) {
                        setcheckSpace(true)
                        return Promise.reject(new Error('マイルストーン名はスペースが含まれていません。'))
                      }

                      return Promise.resolve()
                    },
                  }),
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
                    message: 'この項目は必須です。',

                  },

                  // {
                  //     pattern: /^(?:\d*)$/,
                  //     message: "数字を入力してください",
                  // },
                  () => ({
                    validator(_, value) {
                      // if (value > 5) {
                      // return Promise.reject("Zip code can't be more than 5 ");
                      // }
                      if (value < 0) {
                        return Promise.reject(new Error('半角の整数で入力してください。'))
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input
                  type="number"
                  onKeyDown={blockInvalidChar}
                  addonAfter={selectAfter}
                  //   defaultValue="3"
                  onChange={onValueTimeChange}
                />

              </Form.Item>

              <Modal
                title="マイルストーン編集"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="いいえ"
                okText="はい"
              >
                <p className="mb-5">このまま保存してもよろしいですか？ </p>
              </Modal>

              <Form.Item
                className=" justify-center "
              >
                <div className="flex justify-between my-10 ">
                  <CancelEditMilestone />

                  {/* && timeInput <=5 */}
                  {(nameInput !== '' && timeInput !== '' && checkSpace === false) ? (
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
        </OtherLayout.Main>
      </OtherLayout>
    </div>

  )
}

export default LoginPage
