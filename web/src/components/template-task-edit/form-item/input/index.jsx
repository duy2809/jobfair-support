import React from 'react';
import { Form, Input } from 'antd';
import './style.scss';
const toHalfWidth = (v) =>
  v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  );

const ItemInput = ({ form, label, name, setCheckSpace, setInput }) => {
  const specialCharRegex = new RegExp('[@!?$%]');
  const onValueNameChange = (e) => {
    setCheckSpace(false);
    setInput((prevState) => (prevState = e.target.value));
    let temp = {};
    temp[name] = toHalfWidth(e.target.value);
    form.setFieldsValue(temp);
    console.log(form.getFieldsValue('unit'));
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
      labelAlign='left'
      className='text-4xl justify-between'
      name={name}
      rules={[
        {
          required: true,
          message: 'この項目は必須です。',
        },
        () => ({
          validator(_, value) {
            if (specialCharRegex.test(value)) {
              setCheckSpace(true);
              return Promise.reject(
                new Error(label + 'はスペースが含まれていません。')
              );
            }

            return Promise.resolve();
          },
        }),
      ]}
    >
      <Input
        type='text'
        size='large'
        onChange={onValueNameChange}
        placeholder={label}
      />
    </Form.Item>
  );
};

export default ItemInput;
