import React from 'react'
import { Form, Input } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'
import * as Extensions from '../../../../utils/extensions'

const toHalfWidth = (v) => v.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))

const ItemInput = ({ display, form, name, setCheckSpace, setInput, setConfilm }) => {
  const onValueNameChange = (e) => {
    setConfilm(true)
    setCheckSpace(false)
    setInput(e.target.value)
    const temp = {}
    temp[name] = toHalfWidth(e.target.value)
    form.setFieldsValue(temp)
  }
  const templateTaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    // if (value.match(Extensions.Reg.specialCharacter)) {
    //   return Promise.reject(new Error('使用できない文字が含まれています'))
    // }
    // if (isTemplateExisted === true) {
    //   return Promise.reject(new Error('da ton tai'))
    // }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }

    return Promise.resolve()
  }
  return (
    <Form.Item
      noStyle
      labelAlign="left"
      name={name}
      className="justify-evenly"
      rules={[
        {
          validator: templateTaskNameValidator,
        },
      ]}
    >
      <Input
        style={{ display: display ? 'none' : '' }}
        type="text"
        onChange={onValueNameChange}
        placeholder="テンプレートタスク名l"
      />
    </Form.Item>
  )
}

export default ItemInput

ItemInput.propTypes = {
  display: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  setCheckSpace: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  setConfilm: PropTypes.func.isRequired,
}
