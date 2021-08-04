/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal } from 'antd'
import '../assets/style/PrjAdd.css'

function PrjEdit(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [data,setData] = useState();

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
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={showModal}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
      <Modal
        title="編集カテゴリ"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="キャンセル"
      >
        <input
          type="text"
          required="required"
          placeholder="Edit category"
          className="input-category"
          value={props.name}
        />
      </Modal>
    </>
  )
}

export default PrjEdit
