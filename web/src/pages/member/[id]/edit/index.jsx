import React, { useState } from 'react'
import { Form, Input, Button, Popconfirm, notification, Select, Modal } from 'antd'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Layout from '../../../../layouts/OtherLayout'
import './styles.scss'
import { MemberApi } from '~/api/member'

const EditMember = ({ dataRes }) => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [emailInput, setEmailInput] = useState(dataRes.user.email)
  const [nameInput, setNameInput] = useState(dataRes.user.name)
  const router = useRouter()
  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }
  const onValueEmailChange = (e) => {
    setEmailInput(e.target.value)
  }
  const { Option } = Select

  const openNotificationSuccess = () => {
    notification.success({
      message: '正常に更新されました',
      duration: 1,
    })
  }

  const handleOk = () => {
    openNotificationSuccess()
    router.push(`/member/${member.id}`)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(`/member/${member.id}`)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="text-5xl w-10/12 font-bold py-10 ">メンバ編集</div>
          <Form className="w-10/12" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={form}>
            <Form.Item
              name="member"
              label="フルネーム"
              rules={[
                {
                  message: 'フルネーム必要とされている!',
                  required: (nameInput === ''),
                },
              ]}
            >
              <Input
                size="large"
                onChange={onValueNameChange}
                type="name"
                value={nameInput}
                defaultValue={nameInput}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="メールアドレス"
              rules={[
                {
                  type: 'email',
                  message: 'メールアドレス有効なメールではありません!',
                  required: (emailInput === ''),
                },
              ]}
            >
              <Input
                size="large"
                onChange={onValueEmailChange}
                type="email"
                defaultValue={emailInput}
                value={emailInput}
              />
            </Form.Item>

            <Modal
              title="マイルストーン編集"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              cancelText="いいえ"
              okText="はい"
            >
              <p className="mb-5">このまま保存してもよろしいですか？ </p>
            </Modal>

            <Form.Item
              name={['user', 'category']}
              label="カテゴリ"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" size="large">
                {dataRes.categories.map((item) => {
                  return <Option key={item.id}>{item.category_name}</Option>
                })}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 13 }}>
              <div className="flex mr-8 justify-between">
                <Popconfirm
                  title="変更は保存されていません。続行してもよろしいですか？"
                  onConfirm={handleClick}
                  onCancel={handleCancel}
                  okText="OK"
                  cancelText="キャンセル"
                >
                  <Button
                    size="large"
                    className="text-base px-14"
                    type="primary"
                    htmlType="submit"
                    enabled="true"
                  >
                    キャンセル
                  </Button>
                </Popconfirm>
                <Button
                  size="large"
                  className="text-base px-14 ml-7"
                  type="primary"
                  htmlType="submit"
                  enabled="true"
                  onClick={showModal}
                  disabled={nameInput === '' || emailInput === ''}
                >
                  保存
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Layout.Main>
    </Layout>
  )
}

EditMember.getInitialProps = async (context) => {
  const { id } = context.query
  const res = await MemberApi.getMemberDetail(id)
  const dataRes = res.data
  return { dataRes }
}

EditMember.propTypes = {
  dataRes: PropTypes.object.isRequired,
}

export default EditMember
