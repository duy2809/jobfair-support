import React, { useState, useEffect } from 'react'
import { Avatar } from 'antd'
import { EditFilled } from '@ant-design/icons'
import Otherlayout from '../../layouts/OtherLayout'
<<<<<<< HEAD
import { getProfile, getAvatar } from '../../api/profile'
=======
import { getProfile } from '../../api/profile'
>>>>>>> fix convention
import { webInit } from '../../api/web-init'

export default function Profile() {
  const [avatarUser, setAvatarUser] = useState('')
  const [nameUser, setNameUser] = useState('')
  const [chatWorkIdUser, setChatWorkIdUser] = useState('')
  const [emailUser, setEmailUser] = useState('')
<<<<<<< HEAD
  // useEffect(async () => {
  //   webInit().then((res) => {
  //     // console.log(res)
  //     const id = res.data.auth.user.id
  //     getProfile(id).then((response) => {
  //       // setAvatarUser(response)
  //       setNameUser(response.data.name)
  //       setChatWorkIdUser(response.data.chatwork_id)
  //       setEmailUser(response.data.email)
  //     })
  //     getAvatar().then((avatar)=>{
  //       setAvatarUser(avatar)
  //     })
  //   }, [])
  // })
=======
  useEffect(async () => {
    webInit().then((res) => {
      const id = res.data.auth.user.id
      getProfile(id).then((response) => {
        setAvatarUser(response.data.avatar)
        setNameUser(response.data.name)
        setChatWorkIdUser(response.data.chatwork_id)
        setEmailUser(response.data.email)
      })
    }, [])
  })
>>>>>>> fix convention

  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <p
            className="title mb-11 ml-18"
            style={{ fontSize: '36px', marginBottom: '100px' }}
          >
            プロフィール
          </p>
          <div className="grid grid-cols-12 grid-rows-1 gap-2">
            <div className="row-span-1 col-span-3 justify-self-end">
              <Avatar
                size={150}
                style={{
                  backgroundColor: '#FFD802',
                  lineHeight: '100px',
                  marginRight: '60px',
                }}
<<<<<<< HEAD
                // src={avatarUser}
                src="/api/profile/avatar"
              />
            </div>
            <div className="h-80 col-span-6 border-2 border-gray-300">
=======
                src={avatarUser}
              />
            </div>
            <div className="h-96 col-span-7 border-2 border-gray-300">
>>>>>>> fix convention
              <div className="grid grid-cols-3">
                <div className="col-start-3 pt-4 justify-self-center">
                  <div className="flex items-center gap-4 ">
                    <div>
                      <EditFilled className="border-2 rounded-full py-1 px-1 border-black" />
                    </div>
<<<<<<< HEAD
                    <a href="profile/edit" className="text-blue-500">
=======
                    <a src="" className="text-blue-500">
>>>>>>> fix convention
                      プロフィール編集
                    </a>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="grid grid-cols-12 gap-x-4 gap-y-10 text-lg pt-10">
                <div className="col-span-3 justify-self-end">
                  <p>ユーザー名: </p>
                </div>
                <div className="col-span-9">
                  <p>{nameUser}</p>
                </div>

                <div className="col-span-3 justify-self-end">
                  <p>チャットワークID: </p>
                </div>
                <div className="col-span-9">
                  <p>{chatWorkIdUser}</p>
                </div>

                <div className="col-span-3 justify-self-end">
                  <p>メール: </p>
                </div>
                <div className="col-span-9">
=======
              <div className="grid grid-cols-5 text-lg mt-14 ml-10">
                <div className="col-span-1 mb-10 flex justify-between mr-5">
                  <p>ユーザー名 </p>
                  <p>:</p>
                </div>
                <div className="col-span-4">
                  <p>{nameUser}</p>
                </div>

                <div className="col-span-1 mb-10 flex justify-between mr-5 ">
                  <p>チャットワークID </p>
                  <p>:</p>
                </div>
                <div className="col-span-4">
                  <p>{chatWorkIdUser}</p>
                </div>

                <div className="col-span-1 mb-10 flex justify-between mr-5 ">
                  <p>メール </p>
                  <p>:</p>
                </div>
                <div className="col-span-4">
>>>>>>> fix convention
                  <p>{emailUser}</p>
                </div>
              </div>
            </div>
          </div>
        </Otherlayout.Main>
      </Otherlayout>
    </>
  )
}
