/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Modal, notification } from 'antd'
import { useRouter } from 'next/router'
import CancelEditMilestone from '~/components/CancelEditMilestone'
import OtherLayout from '~/layouts/OtherLayout'
import {
  updateMilestone,
  getMilestone,
  getNameExitEdit,
} from '~/api/milestone'
import Loading from '~/components/loading'
import './styles.scss'

const toHalfWidth = (v) => v.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))

const EditMilestonePage = () => {
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [typePeriodInput, setTypePeriodInput] = useState(0)
  const [checkSpace, setcheckSpace] = useState(false)
  const [form] = Form.useForm()
  const [errorUnique, setErrorUnique] = useState(false)
  const [id, setId] = useState(1)
  const router = useRouter()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { Option } = Select
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    setId(router.query.id)
  }, [])
  useEffect(() => {
    getMilestone(id).then((res) => {
      setNameInput(res.data.name)
      setTimeInput(res.data.period.toString())
      setTypePeriodInput(res.data.is_week)

      form.setFieldsValue({
        name: res.data.name,
        time: res.data.period,
      })
      setLoading(false)
    })
  }, [id])

  const openNotificationSuccess = () => {
    window.location.href = '/master-setting'
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
  }

  const onValueNameChange = (e) => {
    setcheckSpace(false)
    setErrorUnique(false)
    setNameInput(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }
  const onValueTimeChange = (e) => {
    setcheckSpace(false)
    setTimeInput(Number(toHalfWidth(e.target.value)))
    form.setFieldsValue({
      time: toHalfWidth(e.target.value),
    })
    const specialCharRegex = new RegExp(/^([^0-9]*)$/)
    if (specialCharRegex.test(e.target.value)) {
      form.setFields([
        {
          name: 'time',
          errors: ['０以上の半角の整数で入力してください。'],
        },
      ])
    }
  }

  const showModal = () => {
    if (
      nameInput !== ''
      && timeInput !== ''
      && timeInput >= 0
      && checkSpace === false
      && errorUnique === false
    ) {
      setIsModalVisible(true)
    } else {
      const name = nameInput
      if (name !== '') {
        getNameExitEdit(id, name).then((res) => {
          if (res.data.length !== 0) {
            setErrorUnique(true)
            form.setFields([
              {
                name: 'name',
                errors: ['このマイルストーン名は存在しています。'],
              },
            ])
          }
        })
      }
    }
  }

  const handleOk = () => {
    setIsModalVisible(false)
    setLoading(true)
    updateMilestone(id, {
      name: nameInput,
      period: timeInput,
      is_week: typePeriodInput,
    })
      .then(() => {
        openNotificationSuccess()
      })
      .catch((error) => {
        if (
          JSON.parse(error.response.request.response).errors.name[0]
          === 'The name has already been taken.'
        ) {
          notification.error({
            message: 'このマイルストーン名は存在しています',
            duration: 3,
          })
        }
      })
    setLoading(false)
  }
  const onBlur = () => {
    const name = nameInput
    if (name !== '') {
      getNameExitEdit(id, name).then((res) => {
        if (res.data.length !== 0) {
          setErrorUnique(true)
          form.setFields([
            {
              name: 'name',
              errors: ['このマイルストーン名は存在しています。'],
            },
          ])
        }
      })
    }
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
      style={{
        width: 90,
      }}
    >
      <Option value="0">日後</Option>
      <Option value="1">週間後</Option>
    </Select>
  )
  const specialCharRegex = new RegExp('[ 　]')

  return (
    <div className="edit-milestone">
      <Loading loading={loading} overlay={loading} />
      <OtherLayout>
        <OtherLayout.Main>
          <h1 className="title">マイルストーン編集</h1>
          <div className="h-screen flex flex-col items-center pt-10 bg-white my-8">
            <Form
              form={form}
              colon={false}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 12,
              }}
              className="space-y-12 w-1/2 justify-items-center"
              size="large"
            >
              <Form.Item
                label={<p className="font-bold text-right">マイルストーン名</p>}
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
                        return Promise.reject(
                          new Error(
                            'マイルストーン名はスペースが含まれていません。',
                          ),
                        )
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
                  onBlur={onBlur}
                  placeholder="マイルストーン名"
                />
              </Form.Item>

              <Form.Item
                label={<p className="font-bold text-right">期日</p>}
                name="time"
                rules={[
                  {
                    required: true,
                    message: 'この項目は必須です。',
                  },
                  {
                    pattern: /^(?:\d*)$/,
                    message: '０以上の半角の整数で入力してください。',
                  },
                  () => ({
                    validator(_, value) {
                      if (specialCharRegex.test(value)) {
                        setcheckSpace(true)
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input
                  className="inputNumber"
                  type="text"
                  size="large"
                  addonAfter={selectAfter}
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
                centered
              >
                <p className="mb-5">このまま保存してもよろしいですか？ </p>
              </Modal>
              <div className="grid grid-cols-6 grid-rows-1 ">
                <div className="col-start-5 flex justify-end gap-x-4">
                  <Form.Item>
                    <CancelEditMilestone />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={showModal}
                      style={{ letterSpacing: '-0.1em' }}
                    >
                      保存
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
EditMilestonePage.middleware = ['auth:superadmin']
export default EditMilestonePage
