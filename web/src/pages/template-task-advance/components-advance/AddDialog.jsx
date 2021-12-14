/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { PlusOutlined, CloseCircleOutlined, CheckOutlined, EditTwoTone, SearchOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import './AddDialog.module.scss'

export const AddDialog = ({ SampleData, treeData, setTreeData, handleAddText, handleCloseDialog }) => {
  const [text, setText] = useState('')

  // const handleChangeText = (e) => {
  //   setText(e.target.value)
  // }

  // const handleChangeParent = (e) => {
  //   setParent(Number(e.target.value))
  // }

  // const handleChangeDroppable = (e) => {
  //   setDroppable(e.target.checked)
  // }

  // const handleChangeFileType = (e) => {
  //   setFileType(e.target.value)
  // }
  const handleCancel = () => {
    setText('')
    handleCloseDialog()
  }

  const handleChangeText = (e) => {
    setText(e.target.value)
  }

  const handleSubmit = () => {
    handleCloseDialog()
    handleAddText(text)
  }
  return (

    <div className="addText">
      <input
        className="input_edit"
        onChange={handleChangeText}
      />
      <a
        className=""
        onClick={handleSubmit}
        disabled={text === ''}
      >
        <CheckOutlined className="mx-1" />
      </a>
      <a className="" onClick={handleCancel}>
        <CloseCircleOutlined className="" />
      </a>

    </div>
  )
}
