import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'

const { Option } = Select

const toHalfWidth = (v) => v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
const ItemDropdow = ({ form, label, name, setCheckSpace, data, setInput }) => {
  const [fieldName, setFieldName] = useState('')
  const onValueNameChange = (value) => {
    setCheckSpace(false)
    setInput(value)
    const temp = {}
    temp[name] = toHalfWidth(value)
    form.setFieldsValue(temp)
  }
  useEffect(() => {
    if (name === 'category') {
      setFieldName('category_name')
    } else {
      setFieldName('name')
    }
  }, [])
  return (
    <Form.Item
      label={(
        <p
          style={{
            color: '#2d334a',
            fontSize: '18px',
            alignItems: 'start',
          }}
        >
          {label}
        </p>
      )}
      labelAlign="left"
      className="text-4xl justify-between"
      name={name}
      rules={[
        {
          required: true,
          message: 'この項目は必須です。',
        },
      ]}
    >
      <Select onChange={onValueNameChange} placeholder={label}>
        {data.map((item) => (
          <Option key={item.id} value={item[fieldName]}>
            {item[fieldName]}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default ItemDropdow

ItemDropdow.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setCheckSpace: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  setInput: PropTypes.func.isRequired,
}
