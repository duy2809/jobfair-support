import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, Modal, notification } from 'antd'
import Otherlayout from '../../../../layouts/OtherLayout'
import Avatar from '../../UI/avatar/Avatar'
import ButtonChangePassword from '../../UI/button/ButtonChangePassword'
import CancelEditProfile from '../../UI/button/CancelEditProfile'
import './styles.scss'

const EditProfilePage = () => {
  let idProfile;
  const [id, setId] = useState()
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [idChatWorkInput, setIdChatWordInput] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [isDisable, setIsDisable] = useState(false)
  const router = useRouter()
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
    console.log(image)
  }, [image]);

  useEffect(async () => {
    try{
     const temp = /[/](\d+)[/]/.exec(window.location.pathname)
      const id = `${temp[1]}`
      setId(id)
      console.log(idProfile)
      const result = await getUser(id)
      setNameInput(result.name)
      setIdChatWordInput(result.chatwork_id)
      setEmailInput(result.email)
      setImage(result.avatar)
      form.setFieldsValue({
        name: result.name,
        chatwork: result.chatwork_id,
        email: result.email,
        })
    }catch (err) {
      console.error(err)
    }
  }, [])

  const fetchData = async (nameInput) => {
    try {
      const res = await getAllUser()
      const data = res.data.map((item) => item.name)
      const name = data.find((item) => item === nameInput)
      if(name) {
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
    }, 600)
    return () => {
      clearTimeout(timer)
    }
  }, [emailInput])

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 0,

    })
    setTimeout(() => { router.push(`/profile/${idProfile}`) }, 1000)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    updateProfile(id, {
      name: nameInput,
      email: emailInput,
      chatwork_id: idChatWorkInput,
      avatar: image,
    }).then(() => openNotificationSuccess())
      .catch((error) => {
        console.error(error); 
      })
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
            <Avatar preview={preview} setImage={setImage}/>
            <ButtonChangePassword />
          </div>
          <div className="container-form">
            <div className="flex my-8 mx-8">
              <Form
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
                        if(/[!@#$%^&*()_+\-=\[\]{};':"\\/|,.<>]/.test(value)){
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
        <CancelEditProfile onId={id}/>
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