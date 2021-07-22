import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Modal, notification } from 'antd'
// import { useRouter } from 'next/router'
import CancelEditMilestone from '../../../../components/CancelEditMilestone'
import OtherLayout from '../../../../layouts/OtherLayout'
import { updateMilestone, getMilestone } from '../../../../api/milestone'
import './styles.scss'
import { size } from 'lodash'

const toHalfWidth = (v) => v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))

const EditMilestonePage = () => {
  // {query['id']}
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [typePeriodInput, setTypePeriodInput] = useState(0)
  const [checkSpace, setcheckSpace] = useState(false)
  const [form] = Form.useForm()

  // fetch data
  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    getMilestone(id).then((res) => {
      setNameInput(res.data.name)
      setTimeInput(res.data.period.toString())
      setTypePeriodInput(res.data.is_week)

      form.setFieldsValue({
        name: res.data.name,
        time: res.data.period,
      })
    })
  }, [])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const { Option } = Select

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',

    })
  }

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }
  const onValueTimeChange = (e) => {
    setTimeInput(e.target.value)
    form.setFieldsValue({
      time: toHalfWidth(e.target.value),
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    updateMilestone(id, {
      name: nameInput,
      period: timeInput,
      is_week: typePeriodInput,
    }).then(() => openNotificationSuccess())
      .catch((error) => {
        if (JSON.parse(error.response.request.response).errors.name[0] === 'The name has already been taken.') {
          notification.error({
            message: 'このマイルストーン名は存在しています',
          })
        }
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const selectAfter = (
    <Select
      className="select-after"
      onChange={(value) => {
        setTypePeriodInput(parseInt(value, 10))
      }}
      value={typePeriodInput.toString()}
    >
      <Option value="0">日後</Option>
      <Option value="1">週間後</Option>

    </Select>
  )
  const specialCharRegex = new RegExp('[ 　]')

  const blockInvalidChar = (e) => ['e', 'E', '+'].includes(e.key) && e.preventDefault()
  //   const onNumberOnlyChange = (event) => {
  //     const keyCode = event.keyCode || event.which;
  //     const keyValue = String.fromCharCode(keyCode);
  //     const isValid = new RegExp("[0-9]").test(keyValue);
  //     if (!isValid) {
  //        event.preventDefault();
  //        return;
  //     }
  // };

  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <p className="text-4xl title mb-8">マイルストーン編集</p>
          <div className="h-screen flex flex-col items-center pt-10 bg-white my-8">

            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 12,
              }}
              className="space-y-12 w-1/2 justify-items-center"
            >
              <Form.Item
                // label="マイルストーン名"
                label={
                  <p style={{ color: '#2d334a', fontSize: '18px' }}>マイルストーン名</p>
                }
                className="text-4xl"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'この項目は必須です。',
                  },
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
                  size="large"
                  onChange={onValueNameChange}
                  placeholder="マイルストーン名"
                />
              </Form.Item>

              <Form.Item
                // label="期日"
                label={
                  <p style={{ color: '#2d334a', fontSize: '18px'}}>期日</p>
                }
                name="time"
                rules={[
                  {

                    required: true,
                    message: 'この項目は必須です。',

                  },

                  {
                    pattern: /^(?:\d*)$/,
                    message: '半角の整数で入力してください。',
                  },
                  // () => ({
                  //   validator(_, value) {
                  //     // if (value > 5) {
                  //     // return Promise.reject("Zip code can't be more than 5 ");
                  //     // }
                  //     if (value < 0) {
                  //       return Promise.reject(new Error('半角の整数で入力してください。'))
                  //     }
                  //     return Promise.resolve()
                  //   },
                  // }),
                ]}
              >
                <Input
                  className="inputNumber"
                  type="text"
                  size="large"
                  // onKeyPress={onNumberOnlyChange}
                  // min='0'
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
                  {(nameInput !== '' && timeInput !== '' && timeInput >= 0 && checkSpace === false) ? (
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

export default EditMilestonePage
