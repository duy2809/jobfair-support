/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'

function PrjEdit(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [category, setCategory] = useState({ // khoi tao  input name
    id: '',
    name: '',
  })
  // edit
  const onEdit = () => {
    props.onEdit(props.data.id)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    onEdit()
    onEditSubmit()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  function onChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    setCategory({
      [name]: value,
    })
  }

  function onEditSubmit() {
    props.onEditSubmit(category)
  }

  useEffect(() => {
    if (props.cateEdit) {
      setCategory({
        id: props.cateEdit.id,
        name: props.cateEdit.name,
      })
    }
  }, [])

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={showModal}>
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
          onChange={onChange}
          value={category.name}
        />
      </Modal>
    </>
  )
}

export default PrjEdit
