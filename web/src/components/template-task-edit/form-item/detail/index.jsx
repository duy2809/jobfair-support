import React from 'react';
import { Form, Input } from 'antd';
const { TextArea } = Input;

const toHalfWidth = (v) =>
  v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  );

const Detail = ({ form, input, setInput }) => {
  const onValueNameChange = (e) => {
    setInput((prevState) => (prevState = e.target.value));
    form.setFieldsValue({
      description: toHalfWidth(e.target.value),
    });
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
          詳細
        </p>
      }
      className='text-4xl justify-between'
      labelAlign='left'
      name='description'
    >
      <TextArea
        rows={7}
        placeholder='何かを入力してください'
        onChange={onValueNameChange}
        defaultValue={input}
      />
    </Form.Item>
  );
};

export default Detail;
