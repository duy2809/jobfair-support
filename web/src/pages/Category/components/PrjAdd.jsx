import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import '../assets/style/PrjAdd.css'

const PrjAdd = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
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
        <input placeholder="Add category" className="input-category" />
      </Modal>
    </>
  )
}

export default PrjAdd
