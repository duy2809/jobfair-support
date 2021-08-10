import React from 'react'
import { Form, Select, Tag, Tooltip } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'

const { Option } = Select

const toHalfWidth = (v) => {
  const newArr = []
  for (let i = 0; i < v.length; i += 1) {
    newArr.push(
      v[i].replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)),
    )
  }
  return newArr
}

const ItemMultipleDropdown = ({
  form,
  label,
  name,
  options,
  selectedItems,
  setSelectedItems,
}) => {
  const onValueNameChange = (value) => {
    const newArray = options.filter((o) => value.includes(o.name))

    setSelectedItems(newArray)
    const temp = {}
    temp[name] = toHalfWidth(value)
    form.setFieldsValue(temp)
  }
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
      name={name}
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}
      labelAlign="left"
    >
      <Select
        showArrow
        mode="multiple"
        style={{ width: '100%', marginTop: '1.25rem' }}
        placeholder={label}
        className="overflow-hidden"
        maxTagCount="responsive"
        defaultValue={selectedItems.map((item) => item.name)}
        onChange={onValueNameChange}
        tagRender={tagRender}
      >
        {options.map((item) => {
          if (item.name.length > 20) {
            return (
              <Option
                key={item.id}
                value={item.name}
                // style={{
                //   whiteSpace: 'nowrap',
                //   overflow: 'hidden',
                //   textOverflow: 'ellipsis',
                //   maxWidth: '200px',
                // }}
              >
                {`${item.name.slice(0, 20)}...`}
              </Option>
            )
          }
          return (
            <Option key={item.id} value={item.name}>
              {item.name}
            </Option>
          )
        })}
      </Select>
    </Form.Item>
  )
}

function tagRender(props) {
  const { label, value, closable, onClose } = props
  const onPreventMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }
  if (label.length > 20) {
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        <Tooltip title={label}>
          <a href="#">{label}</a>
        </Tooltip>
      </Tag>
    )
  }
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      <a href="#">{label}</a>
    </Tag>
  )
}

export default ItemMultipleDropdown

ItemMultipleDropdown.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
}
