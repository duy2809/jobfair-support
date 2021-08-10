import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
const { Option } = Select;
import './style.scss';

const toHalfWidth = (v) =>
  v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  );
const ItemDropdow = ({ form, label, name, setCheckSpace, data, setInput }) => {
  const [fieldName, setFieldName] = useState('');
  const onValueNameChange = (value) => {
    setCheckSpace(false);
    setInput((prevState) => (prevState = value));
    let temp = {};
    temp[name] = toHalfWidth(value);
    form.setFieldsValue(temp);
  };
  useEffect(() => {
    name === 'category'
      ? setFieldName((prevState) => (prevState = 'category_name'))
      : setFieldName((prevState) => (prevState = 'name'));
  }, []);
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
      labelAlign='left'
      className='text-4xl justify-between'
      name={name}
      rules={[
        {
          required: true,
          message: 'この項目は必須です。',
        },
      ]}
    >
      <Select onChange={onValueNameChange} placeholder={label}>
        {data.map((item) => {
          return (
            <Option key={item.id} value={item[fieldName]}>
              {item[fieldName]}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );
};

export default ItemDropdow;
