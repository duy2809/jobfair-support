import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, notification, Select, Modal } from 'antd'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Layout from '../../../../layouts/OtherLayout'
import './styles.scss'
import { MemberApi } from '~/api/member'
import { CategoryApi } from '~/api/category'
import Loading from '../../../../components/loading'
import * as Extensions from '../../../../utils/extensions'

const EditMember = ({ data }) => {
  const [form] = Form.useForm()
  // const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalCancelVisible, setIsModalCancelVisible] = useState(false)
  const [emailInput, setEmailInput] = useState(data.user.email)
  const [nameInput, setNameInput] = useState(data.user.name)
  const router = useRouter()
  const [categories, setCategories] = useState(
    data.categories.map((item) => item.id),
  )
  const [categoriesSystem, setCategoriesSystem] = useState([])
  const [reqCategories, setReqCategories] = useState(
    data.categories.map((item) => item.id),
  )
  const [showExitPrompt, setShowExitPrompt] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const { id } = router.query

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
    setShowExitPrompt(true)
  }

  const onValueEmailChange = (e) => {
    setEmailInput(e.target.value)
    setShowExitPrompt(true)
  }

  const fetchData = useCallback(() => {
    CategoryApi.getFullCategories().then((res) => {
      setCategoriesSystem(res.data)
    })
  })

  const { Option } = Select

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
  }

  const handleOk = () => {
    setLoading(true)
    // setIsModalVisible(false)
    // setIsModalCancelVisible(false)
    MemberApi.updateMember(id, {
      name: nameInput,
      email: emailInput,
      categories: reqCategories,
    })
      .then(() => {
        router.push(`/member/${data.user.id}`)
        openNotificationSuccess()
      })
      .catch((error) => {
        const errorMessage = error.response.data.errors.name[0]
        notification.error({
          message: errorMessage,
          duration: 3,
        })
        return error
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // const handleCancel = () => {
  //   setIsModalVisible(false)
  // }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(`/member/${data.user.id}`)
  }

  // const showModal = () => {
  //   if (
  //     form.getFieldsError().filter(({ errors }) => errors.length).length === 0
  //   ) {
  //     setIsModalVisible(true)
  //   }
  // }

  const showCancelModal = () => {
    setIsModalCancelVisible(true)
  }

  const handleCancelModal = () => {
    setIsModalCancelVisible(false)
  }

  const handleChangeSelect = (value) => {
    setCategories(value)
    setReqCategories(value)
    setShowExitPrompt(true)
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
    setLoading(false)
  }, [])

  useEffect(() => {
    Extensions.unSaveChangeConfirm(showExitPrompt)
  }, [showExitPrompt])

  return (
    <div>
      <Loading loading={isLoading} overlay={isLoading} />
      <Layout>
        <Layout.Main>
          <h1>メンバ編集</h1>
          <div className="flex flex-col items-center inviteWrapper">
            <Form
              colon={false}
              className="w-2/5"
              labelCol={{ span: 8 }}
              labelAlign="right"
              form={form}
              size="large"
            >
              <Form.Item
                name="name"
                label={<span className="font-bold">フルネーム</span>}
                rules={[
                  {
                    message: 'この項目は必須です',
                    required: true,
                  },
                ]}
              >
                <Input
                  onChange={onValueNameChange}
                  type="name"
                  value={nameInput}
                  defaultValue={nameInput}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={(
                  <span style={{ fontSize: '14px' }} className="font-bold">
                    メールアドレス
                  </span>
                )}
                rules={[
                  {
                    type: 'email',
                    message: 'メールアドレス有効なメールではありません!',
                    required: true,
                  },
                ]}
              >
                <Input
                  onChange={onValueEmailChange}
                  type="email"
                  defaultValue={emailInput}
                  value={emailInput}
                />
              </Form.Item>

              <Form.Item
                name="categories"
                label={(
                  <span style={{ fontSize: '14px' }} className="font-bold">
                    カテゴリ
                  </span>
                )}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  defaultValue={categories}
                  onChange={handleChangeSelect}
                  placeholder="カテゴリ"
                  size="large"
                  className="selectBar"
                >
                  {categoriesSystem.map((item) => (
                    <Option key={item.id} value={item.id}>
                      <p>
                        {item.category_name}
                      </p>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end">
                  <Modal
                    title="メンバ編集"
                    visible={isModalCancelVisible}
                    onOk={handleClick}
                    onCancel={handleCancelModal}
                    cancelText="いいえ"
                    okText="はい"
                    centered
                  >
                    <p className="mb-5">
                      変更内容が保存されません。よろしいですか？
                    </p>
                  </Modal>

                  <Button size="large" onClick={showCancelModal}>
                    キャンセル
                  </Button>
                  <Button
                    size="large"
                    className="ml-4"
                    type="primary"
                    onClick={handleOk}
                  >
                    保存
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Layout.Main>
      </Layout>
    </div>
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

EditMember.middleware = ['auth:superadmin']
export default EditMember
