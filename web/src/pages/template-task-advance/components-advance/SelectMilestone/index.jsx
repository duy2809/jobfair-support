/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
  Select,
  Form,
} from 'antd'
import './style.scss'
import axios from 'axios'

function SelectML({ onMilestoneChange, listMilestone }) {
  const [form] = Form.useForm()

  useEffect(() => {
    let mounted = true
    const fetchApi = async () => {
      try {
        const res = await axios.get(
          'https://61b6019ec95dd70017d40dd2.mockapi.io/advance',
        )
        form.setFieldsValue({
          milestone: res.data[0].milestone_name,
        })
      } catch (error) {
        console.log(error)
      }
    }
    if (mounted) fetchApi()
    // eslint-disable-next-line no-return-assign
    return () => (mounted = false)
  }, [])

  return (
    <div className="selectMilestone">
      <Form
        form={form}
        colon={false}
        initialValues={{ defaultInputValue: 0 }}
      >
        <Form.Item
          name="milestone"

        >
          <Select
            size="large"
            className="addJF-selector"
            style={{ width: '300px' }}
            onChange={onMilestoneChange}
            defaultActiveFirstOption={false}
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
