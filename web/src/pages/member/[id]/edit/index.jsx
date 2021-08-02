import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, Popconfirm, notification, Select, Modal } from 'antd'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Layout from '../../../../layouts/OtherLayout'
import './styles.scss'
import { MemberApi } from '~/api/member'
import { CategoryApi } from '~/api/category'

const EditMember = ({ data }) => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [emailInput, setEmailInput] = useState(data.user.email)
  const [nameInput, setNameInput] = useState(data.user.name)
  const router = useRouter()
  const [categories, setCategories] = useState(data.categories)
  const [categoriesSystem, setCategoriesSystem] = useState([])

  const { id } = router.query

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }

  console.log(data.user.categories)

  const onValueEmailChange = (e) => {
    setEmailInput(e.target.value)
  }

  const fetchData = useCallback(() => {
    CategoryApi.getListCategory().then((res) => {
      setCategoriesSystem(res.data)
    })
  })

  const { Option } = Select

  const openNotificationSuccess = () => {
    notification.success({
      message: '正常に更新されました',
      duration: 1,
    })
  }

  const handleOk = () => {
    MemberApi.updateMember(id, {
      name: nameInput,
      email: emailInput,
      categories,
    }).then(() => {
      openNotificationSuccess()
      router.push(`/member/${data.user.id}`)
    })
      .catch((error) => {
        console.log(error)
        notification.error({
          message: 'Error',
        })
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(`/member/${data.user.id}`)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleChangeSelect = (value) => {
    setCategories(value)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="text-5xl w-10/12 font-bold py-10 ">メンバ編集</div>
          <Form className="w-10/12" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={form}>
            <Form.Item
              name="name"
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
              name="categories"
              label="カテゴリ"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select mode="tags" defaultValue={categories} style={{ width: '100%' }} onChange={handleChangeSelect} placeholder="Tags Mode" size="large">
                {categoriesSystem.map((item) => <Option key={item}>{item}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 17 }}>
              <div className="flex justify-between">
                <Popconfirm
                  title="変更は保存されていません。続行してもよろしいですか？"
                  onConfirm={handleClick}
                  onCancel={handleCancel}
                  okText="OK"
                  cancelText="キャンセル"
                >
                  <Button
                    size="large"
                    className="text-base"
                    type="primary"
                    htmlType="submit"
                    enabled="true"
                  >
                    キャンセル
                  </Button>
                </Popconfirm>
                <Button
                  size="large"
                  className="text-base px-10"
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

EditMember.getInitialProps = async (ctx) => {
  const { id } = ctx.query
  const res = await MemberApi.getMemberDetail(id)
  const dataRes = res.data
  return { data: dataRes }
}

EditMember.propTypes = {
  data: PropTypes.object.isRequired,
}

export default EditMember
