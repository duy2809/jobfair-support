/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Modal, Form, notification } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import { updateCategory, getCategories } from '../../../api/category'

const toHalfWidth = (v) => v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))

const EditCategory = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [checkSpace, setcheckSpace] = useState(false)
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[ 　]')

  useEffect(async () => {
    const id = props.record.id
    getCategories().then((res) => {
      setNameInput(res.data.name)

      form.setFieldsValue({
        name: res.data.name,
      })
    })
  }, [])

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
    })
    setIsModalVisible(false)
    window.location.reload()
  }

  const onValueNameChange = (e) => {
    setcheckSpace(false)
    setNameInput(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    const id = props.record.id
    console.log(id)
    updateCategory(id, {
      category_name: nameInput,
    }).then(() => openNotificationSuccess())
      .catch((error) => {
        notification.error({
          message: 'このカテゴリー名は存在しています',
        })
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <EditTwoTone onClick={showModal} />
      <Modal
        title="編集カテゴリ"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="キャンセル"
      >
        <Form>
          <Form.Item
            // label={
            //   <p style={{ color: '#2d334a', fontSize: '14px' }}>カテゴリー名</p>
            // }
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
                    return Promise.reject(new Error('カテゴリー名はスペースが含まれていません。'))
                  }

                  return Promise.resolve()
                },
              }),
            ]}
          >
            <input
              type="text"
              required="required"
              className="input-category"
              onChange={onValueNameChange}
              placeholder="カテゴリ名を書いてください"
              message="この項目は必須です"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditCategory
