/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Modal, notification, Form, Input, Select } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import {
  updateMilestone,
  getNameExitEdit,
  getMilestone,
} from '../../../api/milestone'
import Loading from '../../loading'

const EditMilestone = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [typePeriodInput, setTypePeriodInput] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [prevNameInput, setPrevNameInput] = useState('')
  const [prevTimeInput, setPrevTimeInput] = useState('')
  const [checkSpace, setcheckSpace] = useState(false)
  const [errorUnique, setErrorUnique] = useState(false)
  const [form] = Form.useForm()
  const role = props.role
  const [loading, setLoading] = useState(false)
  const { Option } = Select

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  useEffect(async () => {
    const id = props.record.id
    getMilestone(id).then((res) => {
      setNameInput(res.data.name)
      setTimeInput(res.data.period.toString())
      setPrevNameInput(res.data.name)
      setPrevTimeInput(res.data.period.toString())
      setTypePeriodInput(res.data.is_week)

      form.setFieldsValue({
        name: res.data.name,
        time: res.data.period,
      })
      setLoading(false)
    })
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const setReloadPage = () => {
    props.reloadPage()
    setIsModalVisible(false)
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setReloadPage()
    // console.log('success')
  }

  const handleOk = () => {
    if (role === 'superadmin') {
      console.log('Handle OK running ...')
      console.log(nameInput, timeInput, checkSpace, errorUnique)
      if (
        nameInput !== ''
        && timeInput !== ''
        && timeInput >= 0
        && checkSpace === false
        && errorUnique === false
      ) {
        setLoading(true)
        console.log('Check oke ending update ...')
        updateMilestone(props.record.id, {
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
              // notification.error({
              //   message: 'このマイルストーン名は存在しています',
              //   duration: 3,
              // })
            }
          })
        setLoading(false)
      } else {
        console.log('Check fail')
        const name = nameInput
        if (name !== '') {
          getNameExitEdit(props.record.id, name).then((res) => {
            console.log('OK then')
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
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onBlur = () => {
    const name = nameInput
    if (name !== '') {
      getNameExitEdit(props.record.id, name).then((res) => {
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

  const onValueNameChange = (e) => {
    setErrorUnique(false)
    setNameInput(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  const onValueTimeChange = (e) => {
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

  const blockInvalidChar = (e) => ['e', 'E', '+'].includes(e.key) && e.preventDefault()
  const specialCharRegex = new RegExp('[ 　]')

  return (
    <>
      <EditTwoTone onClick={showModal} />
      <div>
        <Modal
          title="マイルストーン編集"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="保存"
          cancelText="キャンセル"
          okButtonProps={{ style: { letterSpacing: '-0.1em' } }}
          centered
        >
          <Loading loading={loading} overlay={loading} />
          <Form
            form={form}
            colon={false}
            name="addMilestone"
            initialValues={{
              typePeriod: '0',
            }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            size="large"
          >
            <Form.Item
              label={<p className="font-bold">マイルストーン名</p>}
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
                className="w-full"
                onBlur={onBlur}
                onChange={onValueNameChange}
                placeholder="マイルストーン名"
              />
            </Form.Item>
            <Form.Item
              label={<p className="font-bold">期日</p>}
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
                // type="number"
                type="text"
                placeholder="期日"
                addonAfter={selectAfter}
                onKeyDown={blockInvalidChar}
                onChange={onValueTimeChange}
                min={0}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default EditMilestone
