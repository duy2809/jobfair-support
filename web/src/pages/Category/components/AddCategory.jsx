/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button, notification } from 'antd'
import '../style.scss'
import { addCategory } from '../../../api/category'

const PrjAdd = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [category, setCategory] = useState({ // khoi tao  input name
    name: '',
  })
  const showModal = () => {
    setIsModalVisible(true)
  }
  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
    })
    window.location.reload()
  }

  const handleOk = () => {
    addCategory({
      category_name: category.name,
    }).then(() => openNotificationSuccess())
      .catch((error) => {
        notification.error({
          message: '名は存在しています',
        })
      })
  }

  // add
  function onChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    setCategory({
      [name]: value,
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal} className="add-btn">
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
        <input
          type="text"
          placeholder="カテゴリ名を書いてください"
          className="input-category"
          required="required"
          name="name" // them truong 'name'
          value={category.name}
          onChange={onChange}
        />
      </Modal>
    </>
  )
}

export default PrjAdd
