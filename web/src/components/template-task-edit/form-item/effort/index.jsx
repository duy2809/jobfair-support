import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

const toHalfWidth = (v) => v.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))

const Effort = ({ form, display, unitData, isDayData, setCheckSpace, setInput, setUnit, setIsDay }) => {
  const numberInputValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (Number.isNaN(Number(value))) {
      return Promise.reject(new Error('Input must be a validate number'))
    }
    if (Number(value) <= 0) {
      return Promise.reject(new Error('0以上の半角の整数で入力してください'))
    }

    return Promise.resolve()
  }

  const onValueNameChange = (e) => {
    setCheckSpace(false)
    setInput(e.target.value)
    form.setFieldsValue({
      effort: toHalfWidth(e.target.value),
    })
  }
  const onValueIsDayChange = (value) => {
    setCheckSpace(false)
    setIsDay(isDayData.find((o) => o.name === value).id)
    form.setFieldsValue({
      is_day: toHalfWidth(value),
    })
  }
  const onValueUnitChange = (value) => {
    setCheckSpace(false)
    setUnit(unitData.find((o) => o.name === value).name)
    form.setFieldsValue({
      unit: toHalfWidth(value),
    })
  }
  return (
    <Form.Item
      noStyle
      name="effort"
      labelAlign="left"
      rules={[
        {
          // message: 'この項目は必須です。',
          validator: numberInputValidator,
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
      <div
        className="flex flex-row justify-between items-center "
        style={{ display: display ? 'none' : '' }}
      >
        <Form.Item name="effort" className=" w-1/4 h-full max-w-xs flex-1 pr-5">
          <Input size="large" type="text" placeholder="" onChange={onValueNameChange} />
        </Form.Item>
        <div className="w-3/4 flex justify-center">
          <Form.Item className="w-full" name="is_day">
            <Select
              size="large"
              placeholder="時間"
              style={{ width: '100%' }}
              onChange={onValueIsDayChange}
            >
              {isDayData.map((element) => (
                <Option key={element.id} value={element.name}>
                  {element.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <p className=" text-3xl font-extrabold leading-10"> / </p>
          <Form.Item className="w-full" name="unit">
            <Select
              size="large"
              placeholder="学生数"
              style={{ width: '100%' }}
              onChange={onValueUnitChange}
            >
              {unitData.map((element) => (
                <Option key={element.id} value={element.name}>
                  {element.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
    </Form.Item>
  )
}

export default Effort

Effort.propTypes = {
  form: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  unitData: PropTypes.array.isRequired,
  isDayData: PropTypes.array.isRequired,
  setCheckSpace: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  setUnit: PropTypes.func.isRequired,
  setIsDay: PropTypes.func.isRequired,
}
