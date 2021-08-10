import React, { useState } from 'react';
import { Form, Select, Tag, Tooltip } from 'antd';
import './style.scss';
const { Option } = Select;

// const toHalfWidth = (v) =>
//   v.forEach((item) =>
//     item.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
//       String.fromCharCode(s.charCodeAt(0) - 0xfee0)
//     )
//   );

const toHalfWidth = (v) => {
  let newArr = [];
  for (let i = 0; i < v.length; i++) {
    newArr.push(
      v[i].replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
    );
  }
  return newArr;
};

const ItemMultipleDropdown = ({
  form,
  label,
  name,
  options,
  selectedItems,
  setSelectedItems,
}) => {
  const onValueNameChange = (value) => {
    let newArray = options.filter((o) => value.includes(o.name));

    setSelectedItems(newArray);
    let temp = {};
    temp[name] = toHalfWidth(value);
    form.setFieldsValue(temp);
  };
  return (
    <Form.Item
      label={
        <p
          style={{
            color: '#2d334a',
            fontSize: '18px',
            alignItems: 'start',
          }}
        >
          {label}
        </p>
      }
      name={name}
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}
      labelAlign='left'
    >
      <Select
        showArrow
        mode='multiple'
        style={{ width: '100%', marginTop: '1.25rem' }}
        placeholder={label}
        className='overflow-hidden'
        maxTagCount='responsive'
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
                {item.name.slice(0, 20) + '...'}
              </Option>
            );
          } else {
            return (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            );
          }
        })}
      </Select>
    </Form.Item>
  );
};

function tagRender(props) {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
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
          <a href='#'>{label}</a>
        </Tooltip>
      </Tag>
    );
  } else {
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        <a href='#'>{label}</a>
      </Tag>
    );
  }
}

export default ItemMultipleDropdown;
