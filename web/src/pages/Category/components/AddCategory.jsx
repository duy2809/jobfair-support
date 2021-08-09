/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button, notification, Form } from 'antd'
import '../style.scss'
import { addCategory, checkUniqueAdd } from '../../../api/category'

const AddCategory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [category, setCategory] = useState({ })
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[ 　]')
  const [checkSpace, setcheckSpace] = useState(false)
  const [errorUnique, setErrorUnique] = useState(true)

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setTimeout(() => { window.location.reload() }, 1000)
  }

  const handleOk = () => {
    addCategory({
      category_name: category,
    }).then(() => openNotificationSuccess())
      .catch((error) => {
        notification.error({
          message: 'このカテゴリ名は存在しています',
        })
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // add
  const onValueNameChange = (e) => {
    // setErrorUnique(false)
    setcheckSpace(false)
    setCategory(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
    if (e.target.value !== '') {
      checkUniqueAdd(e.target.value).then((res) => {
        if (res.data.length !== 0) {
          setErrorUnique(true)
          console.log('duplicated')
          console.log(form.getFieldValue('name'))
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

  return (
    <>
      <Button type="primary" onClick={showModal} className="add-btn text-base">
        追加
      </Button>
      <Modal
        title="追加カテゴリ"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="登録"
        cancelText="キャンセル"
      >
        <Form>
          <Form.Item
            label={
              <p> </p>
            }
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
                    return Promise.reject(new Error('カテゴリ名はスペースが含まれていません。'))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <input
              type="text"
              placeholder="カテゴリ名を書いてください"
              className="input-category"
              required="required"
              onChange={onValueNameChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddCategory
