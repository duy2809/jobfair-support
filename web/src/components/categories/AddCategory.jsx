/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button, notification, Form, Input } from 'antd'
import { addCategory, checkUniqueAdd } from '../../api/category'
import Loading from '../loading'
import * as Extensions from '~/utils/extensions'
import './style.scss'

const AddCategory = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [category, setCategory] = useState({})
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[\\s]')
  const [checkSpace, setCheckSpace] = useState(false)
  const [errorUnique, setErrorUnique] = useState(true)
  const role = props.role
  const [loading, setLoading] = useState(false)

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

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
  }

  const handleOk = () => {
    if (role === 'superadmin') {
      setLoading(true)
      addCategory({
        category_name: category,
      })
        .then(() => openNotificationSuccess())
        .catch((error) => {
          const errorResponse = JSON.parse(error.request.response)
          // notification.error({
          //   message: errorResponse.errors.category_name[0],
          //   duration: 3,
          // })
          form.setFields([
            {
              name: 'name',
              errors: [errorResponse.errors.category_name[0]],
            },
          ])
        })
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  // const onBlur = () => {
  //   const name = category
  //   if (name !== '') {
  //     checkUniqueAdd(name).then((res) => {
  //       if (res.data.length !== 0) {
  //         setErrorUnique(true)
  //         form.setFields([
  //           {
  //             name: 'name',
  //             errors: ['このカテゴリ名は存在しています'],
  //           },
  //         ])
  //       }
  //     })
  //   }
  // }

  const onValueNameChange = (e) => {
    setCheckSpace(false)
    setCategory(toHalfWidth(e.target.value))
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        size="large"
      >
        <span>追加</span>
      </Button>
      <Modal
        className="add-category"
        title="カテゴリ追加"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="登録"
        cancelText="キャンセル"
        okButtonProps={{ style: { letterSpacing: '-0.1em' } }}
        centered
      >
        <Loading loading={loading} overlay={loading} />
        <Form
          form={form}
          layout="horizontal"
          labelCol={{
            span: 8,
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
              // () => ({
              //   validator(_, value) {
              //     if (specialCharRegex.test(value)) {
              //       setCheckSpace(true)
              //       return Promise.reject(new Error('カテゴリ名はスペースが含まれていません。'))
              //     }

              //     return Promise.resolve()
              //   },
              // }),
            ]}
          >
            <Input
              type="text"
              placeholder="例: 2次面接練習"
              className="input-category"
              required="required"
              style={{ width: '-webkit-fill-available', paddingLeft: 10, marginTop: -4 }}
              onChange={onValueNameChange}
              // onBlur={onBlur}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddCategory
