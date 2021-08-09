/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Modal, Form, notification } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import { updateCategory, getCategories, checkUniqueEdit } from '../../../api/category'

const toHalfWidth = (v) => v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))

const EditCategory = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [nameInput, setNameInput] = useState({})
  const [checkSpace, setcheckSpace] = useState(false)
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[ 　]')
  const [errorUnique, setErrorUnique] = useState(true)

  useEffect(async () => {
    const id = props.record.id
    getCategories(id).then((res) => {
      setNameInput(res.data.name)
      form.setFieldsValue({
        name: res.data.name,
      })
    })
  }, [])

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setIsModalVisible(false)
    setTimeout(() => { window.location.reload() }, 1000)
  }

  const onValueNameChange = (e) => {
    setcheckSpace(false)
    setNameInput(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })

    if (e.target.value !== '') {
      checkUniqueEdit(e.target.value).then((res) => {
        if (res.data.length !== 0) {
          setErrorUnique(true)
          console.log('duplicated')
          console.log(form.getFieldValue('name'))
          form.setFields([
            {
              name: 'name',
              errors: [new Error('このカテゴリ名は存在しています。')],
            },
          ])
        }
      })
    }
  }

  const showModal = (e) => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    const id = props.record.id
    updateCategory(id, {
      category_name: nameInput,
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
              required="required"
              className="input-category"
              onChange={onValueNameChange}
              placeholder="カテゴリ名を書いてください"
              defaultValue={props.record.name}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditCategory
