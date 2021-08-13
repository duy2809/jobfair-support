import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, notification, Select, Modal } from 'antd'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Layout from '../../../../layouts/OtherLayout'
import './styles.scss'
import { MemberApi } from '~/api/member'
import { CategoryApi } from '~/api/category'

const EditMember = ({ data }) => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalCancelVisible, setIsModalCancelVisible] = useState(false)
  const [emailInput, setEmailInput] = useState(data.user.email)
  const [nameInput, setNameInput] = useState(data.user.name)
  const router = useRouter()
  const [categories, setCategories] = useState(data.categories)
  const [categoriesSystem, setCategoriesSystem] = useState([])
  const [reqCategories, setReqCategories] = useState([])

  const { id } = router.query

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }

  const onValueEmailChange = (e) => {
    setEmailInput(e.target.value)
  }

  const fetchData = useCallback(() => {
    CategoryApi.getFullCategories().then((res) => {
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
      categories: reqCategories,
    }).then(() => {
      openNotificationSuccess()
      router.push(`/member/${data.user.id}`)
    })
      .catch((error) => {
        notification.error({
          message: error.response.data.errors.email || error.response.data.errors.name,
        })
      }).finally(() => {
        setIsModalCancelVisible(false)
        setIsModalVisible(false)
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
    if (form.getFieldsError().filter(({ errors }) => errors.length).length === 0) {
      setIsModalVisible(true)
    }
  }

  const showCancelModal = () => {
    setIsModalCancelVisible(true)
  }

  const handleCancelModal = () => {
    setIsModalCancelVisible(false)
  }

  const handleChangeSelect = (value) => {
    setCategories(value)
    const result = value.map((item) => categoriesSystem.indexOf(item) + 1)
    setReqCategories(result)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="text-5xl w-11/12 title">メンバ編集</div>
          <Form className="w-8/12 pt-10" labelCol={{ span: 7 }} labelAlign="left" form={form}>
            <Form.Item
              className="mx-10"
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
              className="mx-10"
              name="email"
              label="メールアドレス"
              rules={[
                {
                  type: 'email',
                  message: 'メールアドレス有効なメールではありません!',
                  required: true,
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
              title="メンバ編集"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              cancelText="いいえ"
              okText="はい"
            >
              <p className="mb-5">このまま保存してもよろしいですか？ </p>
            </Modal>

            <Form.Item
              className="mx-10"
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

            <Form.Item>
              <div className="w-full flex justify-end">
                <Modal
                  title="変更は保存されていません。続行してもよろしいですか？"
                  visible={isModalCancelVisible}
                  onOk={handleClick}
                  onCancel={handleCancelModal}
                  cancelText="いいえ"
                  okText="はい"
                >
                  <p className="mb-5">このまま保存してもよろしいですか？ </p>
                </Modal>

                <Button
                  size="large"
                  className="text-base"
                  enabled="true"
                  onClick={showCancelModal}
                >
                  キャンセル
                </Button>
                <Button
                  size="large"
                  className="text-base px-10 ml-4"
                  type="primary"
                  htmlType="submit"
                  enabled="true"
                  onClick={showModal}
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
