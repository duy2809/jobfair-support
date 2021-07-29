/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import '../style.scss'

const PrjAdd = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [category, setCategory] = useState({ // khoi tao  input name
    name: '',
  })

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    onSubmit()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
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

  function onSubmit() {
    props.onSubmit(category)
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
          placeholder="Add category"
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
