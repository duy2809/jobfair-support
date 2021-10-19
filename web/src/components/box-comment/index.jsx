import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Select, Button, Form, Input, Tag, Tooltip, Modal } from 'antd'
import PropTypes from 'prop-types'
import './style.scss'
import dynamic from 'next/dynamic'
import {
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { getUser, taskData } from '../../api/task-detail'
import { isEmpty } from 'lodash'

const BoxComment = ({ id }) => {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(true)
  const [showLink, setShowLink] = useState(false)
  const [form] = Form.useForm()
  const [listUser, setListUser] = useState([])
  const [assign, setAssign] = useState(true)
  const [value, setValue] = useState('')
  const [link, setLink] = useState('')
  const [text, setText] = useState('')

  const MDEditor = dynamic(
    // eslint-disable-next-line import/no-unresolved
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false },
  )

  // const commands = dynamic(
  //   () => import('@uiw/react-md-editor').then((mod) => mod.default),
  //   { ssr: false },
  // )
  // Modal
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }
  const title = {
    name: 'link',
    keyCommand: 'link',
    buttonProps: { 'aria-label': 'Add a link', title: 'Add a link' },
    icon: (
      <svg data-name="italic" width="12" height="12" role="img" viewBox="0 0 520 520">
        <path
          fill="currentColor"
          d="M331.751196,182.121107 C392.438214,241.974735 391.605313,337.935283 332.11686,396.871226 C332.005129,396.991316 331.873084,397.121413 331.751196,397.241503 L263.493918,464.491645 C203.291404,523.80587 105.345257,523.797864 45.151885,464.491645 C-15.0506283,405.187427 -15.0506283,308.675467 45.151885,249.371249 L82.8416853,212.237562 C92.836501,202.39022 110.049118,208.9351 110.56511,222.851476 C111.223305,240.5867 114.451306,258.404985 120.407566,275.611815 C122.424812,281.438159 120.983487,287.882964 116.565047,292.23621 L103.272145,305.332975 C74.8052033,333.379887 73.9123737,379.047937 102.098973,407.369054 C130.563883,435.969378 177.350591,436.139505 206.033884,407.879434 L274.291163,340.6393 C302.9257,312.427264 302.805844,266.827265 274.291163,238.733318 C270.531934,235.036561 266.74528,232.16442 263.787465,230.157924 C259.544542,227.2873 256.928256,222.609848 256.731165,217.542518 C256.328935,206.967633 260.13184,196.070508 268.613213,187.714278 L289.998463,166.643567 C295.606326,161.118448 304.403592,160.439942 310.906317,164.911276 C318.353355,170.034591 325.328531,175.793397 331.751196,182.121107 Z M240.704978,55.4828366 L172.447607,122.733236 C172.325719,122.853326 172.193674,122.983423 172.081943,123.103513 C117.703294,179.334654 129.953294,261.569283 185.365841,328.828764 C191.044403,335.721376 198.762988,340.914712 206.209732,346.037661 C212.712465,350.509012 221.510759,349.829503 227.117615,344.305363 L248.502893,323.234572 C256.984277,314.87831 260.787188,303.981143 260.384957,293.406218 C260.187865,288.338869 257.571576,283.661398 253.328648,280.790763 C250.370829,278.78426 246.58417,275.912107 242.824936,272.215337 C214.310216,244.121282 206.209732,204.825874 229.906702,179.334654 L298.164073,112.094263 C326.847404,83.8340838 373.633159,84.0042113 402.099123,112.604645 C430.285761,140.92587 429.393946,186.594095 400.92595,214.641114 L387.63303,227.737929 C383.214584,232.091191 381.773257,238.536021 383.790506,244.362388 C389.746774,261.569283 392.974779,279.387637 393.632975,297.122928 C394.149984,311.039357 411.361608,317.584262 421.356437,307.736882 L459.046288,270.603053 C519.249898,211.29961 519.249898,114.787281 459.047304,55.4828366 C398.853851,-3.82360914 300.907572,-3.83161514 240.704978,55.4828366 Z"
        />
      </svg>
    ),
    execute: () => {
      showModal()
    },
  }

  const handleOk = () => {
    if (!isEmpty(text) && link !== ' ') {
      setValue(` ${value}[${text}](${link})`)
    } else {
      setValue(`${value} ${link}`)
    }
    setIsModalVisible(false)
    setText('')
    setLink('')
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showBox = () => {
    setVisible(true)
    setShow(false)
  }

  const closeBox = () => {
    setVisible(false)
    setShow(true)
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

  const fetchTaskData = async () => {
    await taskData(id)
      .then((response) => {
        const listmember = []
        response.data.users.forEach((element) => {
          listmember.push(element.name)
        })
        form.setFieldsValue({
          assignee: listmember,
          status: response.data.status,
        })
      })
  }

  useEffect(() => {
    fetchListMember()
    fetchTaskData()
  }, [])

  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']

  const tagRenderr = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const nameUser = form.getFieldValue('assignee')
    if (nameUser.length !== 0) {
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
          }
          if (nameUsers.length !== 0) {
            setAssign(true)
          }
        }}
        // style={{ marginRight: '3px', paddingTop: '5px', paddingBottom: '3px' }}
        style={{ padding: '7px' }}
      >
        <Tooltip title={label}>
          <span className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden">
            {label}
          </span>
        </Tooltip>
      </Tag>
    )
  }

  return (
    <div className="mt-5 box-comment">
      {show ? (
        <div className="flex">
          <Input
            style={{ width: '89%' }}
            onClick={showBox}
            placeholder="コメントを入力してください"
          />
          <div className="btn" onClick={showBox} style={{ cursor: 'pointer' }}>
            <EditOutlined className="ml-6" />
            <span>ステータス変更</span>
          </div>
        </div>
      ) : null}
      {visible ? (
        <div className="box">
          <Form form={form} layout="vertical">
            <div className="pos flex items-center justify-between">
              <div className="pos-left">
                <Form.Item
                  label=""
                  className="block mx-7"
                  style={{ display: 'block' }}
                  name="detail"
                >
                  <div>
                    <MDEditor
                      preview="edit"
                      height="200"
                      value={value}
                      onChange={setValue}
                      commands={[title]}
                    />
                    <Modal
                      title="ファイル追加"
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText="保存"
                      cancelText="キャンセル"
                    >
                      <div className="flex items-center justify-between">
                        <div className="ml-4">
                          <Input
                            size="large"
                            style={{ width: '180%', height: '40px' }}
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                          />
                        </div>
                        <div className="">
                          <PlusCircleOutlined
                            style={{ fontSize: '25px', cursor: 'pointer' }}
                            onClick={() => {
                              setShowLink(!showLink)
                            }}
                          />
                        </div>
                      </div>
                      {showLink ? (
                        <div className="mt-6">
                          <Form
                            layout="horizontal"
                            colon={false}
                            labelAlign="right"
                            className="mr-14"
                            labelCol={{
                              span: 5,
                            }}
                          >
                            <Form.Item label={<p className="font-bold text-right mt-6">テキスト</p>}>
                              <Input onChange={(event) => setText(event.target.value)} value={text} size="large" placeholder="Add text" />
                            </Form.Item>
                            <Form.Item label={<p className="font-bold text-right mt-6">リンク</p>}>
                              <Input onChange={(event) => setLink(event.target.value)} value={link} size="large" placeholder="Add text" />
                            </Form.Item>
                          </Form>
                        </div>
                      ) : null}
                    </Modal>
                  </div>
                </Form.Item>
              </div>
              <div className="pos-right">
                <Form.Item label={<p className="font-bold">ステータス</p>} name="status">
                  <Select size="large" className="addJF-selector" placeholder="ステータス">
                    {listStatus.map((element) => (
                      <Select.Option value={element}>{element}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={<p className="font-bold">担当者</p>}
                  name="assignee"
                  className="multiples"
                >
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
            <div className="flex items-center justify-center ">
              <Form.Item label=" " className=" ">
                <div className="flex">
                  <Button
                    htmlType="button"
                    type="primary"
                    className="button_cancel"
                    onClick={closeBox}
                  >
                    キャンセル
                  </Button>
                  <Button htmlType="button" type="primary" className="button_preview mx-3">
                    プレビュー
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button_save"
                    style={{ letterSpacing: '-1px' }}
                  >
                    <span>追加</span>
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default BoxComment

BoxComment.propTypes = {
  id: PropTypes.object.isRequired,
}
