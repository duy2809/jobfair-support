/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Select, Button, Form, Input } from 'antd'
import { getUser, taskData } from '../../api/task-detail'
import './style.scss'
import {
    EditOutlined
  } from '@ant-design/icons'

const BoxComment = ({id}) => {
    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(true)
    const [data, setData] = useState([])
    const hide = () => setVisible(false)
    const [form] = Form.useForm()
    const [listUser, setListUser] = useState([])
    const [assign, setAssign] = useState(true)
    const { TextArea } = Input
    const [isEdit, setIsEdit] = useState(false)

    const showBox = () => {
        setVisible(true)
        setShow(false)
    }

    const fetchListMember = async () => {
        await getUser()
          .then((response) => {
            setListUser(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
    }

    const getData = async () => {
      await taskData(id)
        .then((response) => {
          setData(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    useEffect(()=>{
      fetchListMember()
      getData()
    },[])
    
    const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']

    const tagRenderr = (props) => {
        // eslint-disable-next-line react/prop-types
        const { label, closable, onClose } = props
        const nameUser = form.getFieldValue('assignee')
        if (nameUser.length !== 0) {
          document.getElementById('error-user').setAttribute('hidden', 'text-red-600')
          setAssign(true)
        }
        const onPreventMouseDown = (event) => {
          event.preventDefault()
          event.stopPropagation()
        }
        return (
          <Tag
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={() => {
              onClose()
              const nameUsers = form.getFieldValue('assignee')
              if (nameUsers.length === 0) {
                setAssign(false)
                document.getElementById('error-user').removeAttribute('hidden', 'text-red-600')
              }
              if (nameUsers.length !== 0) {
                setAssign(true)
                document.getElementById('error-user').setAttribute('hidden', 'text-red-600')
              }
            }}
            style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
          >
            <Tooltip title={label}>
              <span className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden">
                {label}
              </span>
            </Tooltip>
          </Tag>
        )
      }

    const TaskNameValidator = (_, value) => {
        if (!value) {
          return Promise.reject(new Error('この項目は必須です'))
        }
        if (value.match(Extensions.Reg.specialCharacter)) {
          return Promise.reject(new Error('使用できない文字が含まれています'))
        }
        if (value.match(Extensions.Reg.onlyNumber)) {
          return Promise.reject(new Error('数字のみを含めることはできない'))
        }
    
        return Promise.resolve()
      }

    return (
    <div className="mt-5 box-comment">
        {show ?  <div className="flex">
            <Input 
                style={{width:'90%'}}
                onClick={showBox}
                placeholder="コメントを入力してください"
            />
            <div className="mt-2 flex">
                <EditOutlined
                    onClick={showBox}     
                />
                <p>ステータス変更</p>
            </div>
        </div>:null}
       
        {visible ?   
        <div className="box">
            <Form
                layout="vertical"
                labelCol={{
                    span: 6,
                  }}
            >
            <div className="flex">
              <div className="col-8">

                <Form.Item
                  label=""
                  className="block mx-7"
                  style={{ display: 'block' }}
                  name="detail"
                >
                <TextArea className="text-area-description w-100" rows={10} placeholder="何かを入力してください" />
                </Form.Item>
              </div>
              <div className="col-4">
              <Form.Item
                    label="ステータス"
                    name="status"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      className="addJF-selector"
                      placeholder="ステータス"
                    >
                      {listStatus.map((element) => (
                        <Select.Option value={element}>{element}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                <Form.Item label="担当者" name="assignee" required className="multiples">
                {assign ? (
                    <Select mode="multiple" showArrow tagRender={tagRenderr}>
                    {listUser.map((element) => (
                        <Select.Option
                        className="validate-user"
                        key={element.id}
                        value={element.name}
                        >
                        {element.name}
                        </Select.Option>
                    ))}
                    </Select>
                ) : (
                    <Select
                    mode="multiple"
                    showArrow
                    tagRender={tagRenderr}
                    style={{ width: '100%', border: '1px solid red', borderRadius: 6 }}
                    className="multiples"
                    >
                    {listUser.map((element) => (
                        <Select.Option
                        className="validate-user"
                        key={element.id}
                        value={element.name}
                        >
                        {element.name}
                        </Select.Option>
                    ))}
                    </Select>
                )}
                </Form.Item>
              </div>
              
            </div>
              
            
            </Form>
        </div>
        : null}
      



        
    </div>
  )
}

export default BoxComment
