/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
  Select,
  Form,
} from 'antd'
import './style.scss'

function SelectML({ onMilestoneChange, listMilestone }) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      milestone: listMilestone.length > 0 ? listMilestone[0].name : null,
    })
  }, [])
  return (
    <div className="selectMilestone">
      <Form
        form={form}
        colon={false}

      >
        <Form.Item
          name="milestone"
        >
          <Select
            size="large"
            className="addJF-selector"
            placeholder="milestone name"
            style={{ width: '300px' }}
            onChange={onMilestoneChange}
          >
            { listMilestone && listMilestone.map((element) => (
              <Select.Option key={element.id} value={element.id}>
                {element.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

    </div>
  )
}

export default SelectML
