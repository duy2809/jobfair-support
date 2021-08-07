import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, Modal, notification } from 'antd'
import Otherlayout from '../../../layouts/OtherLayout'
import Avatar from '../UI/avatar/Avatar'
import ButtonChangePassword from '../UI/button/ButtonChangePassword'
import CancelEditProfile from '../UI/button/CancelEditProfile'
import { updatePassword, updateInfo, updateAvatar, getAllProfile, getProfile, getAvatar } from '../../../api/profile'
import { webInit } from '../../../api/web-init'
import './styles.scss'

const EditProfilePage = () => {
  let userId;
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [idChatWorkInput, setIdChatWordInput] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [image, setImage] = useState()
  const [avatarUser, setAvatarUser] = useState()
  const [preview, setPreview] = useState()
  const [isDisable, setIsDisable] = useState(false)
  const router = useRouter()

  webInit().then((res) => {
    const id = res.data.auth.user.id
    getAvatar(id).then(() => {
      const link = `/api/avatar/${id}`
      setAvatarUser(link)
    })
  }, [])
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  useEffect(async () => {
    try{
      const resId = await webInit()
      const id = resId.data.auth.user.id
      userId = id
      const result = await getProfile(id)
      const data = result.data
      setNameInput(data.name)
      setIdChatWordInput(data.chatwork_id)
      setEmailInput(data.email)
      form.setFieldsValue({
        name: data.name,
        chatwork: data.chatwork_id,
        email: data.email,
        })
    }catch (err) {
      console.error(err)
    }
  }, [])

  const fetchData = async (nameInput) => {
    try {
      const resId = await webInit()
      const id = resId.data.auth.user.id
      const resCur = await getProfile(id)
      const emailCur = resCur.data.email
      const res = await getAllProfile()
      const data = res.data.map((item) => item.email)
      const email = data.find((item) => item === nameInput)
      if(email && email !== emailCur) {
        setIsDisable(true)
        form.setFields([
          {
            name: 'email',
            errors: ['このメールは既に存在しました。'],
          },
        ])
      }
    }catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(emailInput)
    }, 100)
    return () => {
      clearTimeout(timer)
    }
  }, [emailInput])

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 0,

    })
    setTimeout(() => { router.push('/profile') }, 1000)
  }

  const handleOk = async () => {
    try {
      setIsModalVisible(false)
      const data = await webInit()
      const id = data.data.auth.user.id
      updateInfo(id, {
        name: nameInput,
        email: emailInput,
        chatwork_id: idChatWorkInput,
      })
      openNotificationSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onNameChange = (e) => {
    setIsDisable(false);
    setNameInput(e.target.value)
  }

  const onChatworkIdChange =(e) => {
    setIsDisable(false);
    setIdChatWordInput(e.target.value)
  }

  const onEmailChange = (e) => {
    setIsDisable(false);
    setEmailInput(e.target.value)
  }

  const specialCharRegex = new RegExp('[ 　]')

  return (
    <div>
    <Otherlayout>
      <Otherlayout.Main>
        <p className="title mb-8" style={{ fontSize: '36px' }}>プロフィール編集</p>
        <div className="container">
          <div className="grid justify-items-center">
            <Avatar preview={preview} setImage={setImage} avatar={avatarUser}/>
            <ButtonChangePassword />
          </div>
          <div className="container-form">
            <div className="flex my-8 mx-8">
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 12,
                }}
                className="w-3/4 my-6"
              >
                <Form.Item
                  label={
                    <p style={{ color: '#2d334a', fontSize: '18px' }}>ユーザー名&emsp;&emsp;&emsp;</p>
                  }
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'この項目は必須です。',
                    },
                    () => ({
                      validator(_, value){
                        if(/[0-9]/.test(value)) {
                          setIsDisable(true)
                          return Promise.reject(
                            new Error(
                              '数字を入力しないでください。',
                            ),
                          )
                        }
                        if(/[!@#$%^&*()_+\-=\[\]{};':"\\/|,<>]/.test(value)){
                          setIsDisable(true)
                          return Promise.reject(
                            new Error(
                              '特殊文字を入力しないでください。',
                            ),
                          )
                        }
  
                        return Promise.resolve()
                      }
                    })
                  ]}
                >
                  <Input
                    type="text"
                    size="large"
                    onChange={onNameChange}
                    placeholder="ユーザー名"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <p style={{ color: '#2d334a', fontSize: '18px' }}>チャットワークID</p>
                  }
                  name="chatwork"

                  rules={[
                    {
                      required: true,
                      message: 'この項目は必須です。',
                    },
                    () => ({
                      validator(_, value) {
                        if (specialCharRegex.test(value)) {
                          setIsDisable(true)
                          return Promise.reject(new Error('スペースを入力しないでください'))
                        }
                        if(/[!@#$%^&*()_+\-=\[\]{};':"\\/|,.<>]/.test(value)){
                          setIsDisable(true)
                          return Promise.reject(
                            new Error(
                              '特殊文字を入力しないでください。',
                            ),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    type="text"
                    size="large"
                    onChange={onChatworkIdChange}
                    placeholder="チャットワークID"
                  />

                </Form.Item>

                <Form.Item 
                  label={ 
                    <p style={{ color: '#2d334a', fontSize: '18px'}}>メール&emsp;&emsp;&emsp;&emsp;&emsp;</p>
                  }
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'この項目は必須です。',
                    },
                    () => ({
                      validator(_, value) {
                        if(!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value) && value !== ''){
                          setIsDisable(true)
                          return Promise.reject(
                            new Error(
                              '特殊文字を入力しないでください。',
                            ),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >

                  <Input
                    type="text"
                    size="large"
                    onChange={onEmailChange}
                    placeholder="メール"
                  />
                
                </Form.Item>

                <Modal
                title="プロフィール編集"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="いいえ"
                okText="はい"
              >
                <p className="mb-5">このまま保存してもよろしいですか？ </p>
              </Modal>

              </Form>
            </div>
          </div>
        </div>
        <div className="container-btn justify-end">
        <CancelEditProfile />
        {(nameInput !== '' && emailInput !== '' && idChatWorkInput !== '' && isDisable === false) ? (
          <Button
            type="primary"
            htmlType="submit"
            style={{borderColor: '#ffd803'}}
            className="text-base px-9 mr-10"
            onClick={showModal}
          >
            保存
          </Button>) : (
        <Button 
          type="primary"
          className="text-base px-9 mr-10"
          htmlType="submit"
          onClick={showModal}
          disabled
        >
            保存
        </Button>
        )}
        </div>
      </Otherlayout.Main>
    </Otherlayout>
  </div>
  )
}

export default EditProfilePage;