/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Modal, Form, notification, Input } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import { updateCategory, getCategories, checkUniqueEdit } from '../../api/category'
import Loading from '../loading'

const EditCategory = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [nameInput, setNameInput] = useState({})
  const [checkSpace, setCheckSpace] = useState(false)
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[ 　]')
  const role = props.role
  const [loading, setLoading] = useState(true)

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  useEffect(async () => {
    const id = props.record.id
    getCategories(id).then((res) => {
      setNameInput(res.data.name)
      form.setFieldsValue({
        name: res.data.name,
      })
      setLoading(false)
    })
  }, [])

  const setReloadPage = () => {
    props.reloadPage()
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setIsModalVisible(false)
    setReloadPage()
  }

  const onBlur = () => {
    const name = nameInput
    const id = props.record.id
    if (name !== '') {
      checkUniqueEdit(id, name).then((res) => {
        if (res.data.length !== 0) {
          form.setFields([
            {
              name: 'name',
              errors: ['このカテゴリ名は存在しています'],
            },
          ])
        }
      })
    }
  }

  const onValueNameChange = (e) => {
    setCheckSpace(false)
    setNameInput(toHalfWidth(e.target.value))
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  const showModal = (e) => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (role === 'superadmin') {
      const id = props.record.id
      setLoading(true)
      updateCategory(id, {
        category_name: nameInput,
      })
        .then(() => {
          openNotificationSuccess()
        })
        .catch((error) => {
          notification.error({
            message: 'このカテゴリ名は存在しています',
          })
        })
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <EditTwoTone onClick={showModal} />
      <div>
        <Modal
          title="カテゴリ編集"
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
            layout="horizontal"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            colon={false}
          >
            <Form.Item
              label={<span className="font-bold">カテゴリ名</span>}
              name="name"
              rules={[
                {
                  required: true,
                  message: 'この項目は必須です。',
                },
                () => ({
                  validator(_, value) {
                    if (specialCharRegex.test(value)) {
                      setCheckSpace(true)
                      return Promise.reject(new Error('カテゴリ名はスペースが含まれていません。'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input
                type="text"
                required="required"
                className="input-category"
                style={{ width: '-webkit-fill-available', paddingLeft: 10 }}
                onChange={onValueNameChange}
                onBlur={onBlur}
                placeholder="カテゴリ名を書いてください"
                defaultValue={props.record.name}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default EditCategory
