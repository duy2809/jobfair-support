import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Space } from 'antd';
const { Option } = Select;

const toHalfWidth = (v) =>
  v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  );

const Effort = ({
  form,
  unitData,
  isDayData,
  setCheckSpace,
  setInput,
  setUnit,
  setIsDay,
}) => {
  const specialCharRegex = new RegExp('[ 　]');
  const onValueNameChange = (e) => {
    setCheckSpace(false);
    setInput((prevState) => (prevState = e.target.value));
    form.setFieldsValue({
      effort: toHalfWidth(e.target.value),
    });
  };
  const onValueIsDayChange = (value) => {
    setCheckSpace(false);
    setInput(
      (prevState) => (prevState = isDayData.find((o) => o.name == value).id)
    );
    form.setFieldsValue({
      is_day: toHalfWidth(value),
    });
  };
  const onValueUnitChange = (value) => {
    setCheckSpace(false);
    setUnit((prevState) => (prevState = value));
    form.setFieldsValue({
      unit: toHalfWidth(value),
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
          工数
        </p>
      }
      name='effort'
      labelAlign='left'
      className='text-4xl justify-between'
      rules={[
        {
          required: true,
          message: 'この項目は必須です。',
        },

        // {
        //   pattern: /^(?:\d*)$/,
        //   message: '０以上の半角の整数で入力してください。',
        // },

        // () => ({
        //   validator(_, value) {
        //     // if (value < 0) {
        //     //   return Promise.reject(
        //     //     new Error('半角の整数で入力してください。')
        //     //   );
        //     // }
        //     if (specialCharRegex.test(value)) {
        //       setCheckSpace(true);
        //     }
        //     return Promise.resolve();
        //   },
        // }),
      ]}
    >
      <div className='flex flex-row justify-between '>
        <Form.Item name='effort' className='w-1/2 max-w-xs flex-1 mt-0.5'>
          <Input
            type='text'
            placeholder=''
            style={{ width: '80px' }}
            onChange={onValueNameChange}
          />
        </Form.Item>
        <Space>
          <Form.Item name='is_day'>
            <Select
              placeholder='時間'
              style={{ width: '150px' }}
              onChange={onValueIsDayChange}
            >
              {isDayData.map((element) => (
                <Option key={element.id} value={element.name}>
                  {element.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <p className='slash-devider text-2xl font-extrabold mb-7'> / </p>

          <Form.Item name='unit'>
            <Select
              placeholder='学生数'
              style={{ width: '150px' }}
              onChange={onValueUnitChange}
            >
              {unitData.map((element) => (
                <Option key={element.id} value={element.name}>
                  {element.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
      </div>
    </Form.Item>
  );
};

export default Effort;
