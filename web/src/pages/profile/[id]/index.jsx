import React, {useState} from "react";
import Otherlayout from "../../../layouts/OtherLayout";
import { Avatar } from "antd";
import { UserOutlined, EditFilled } from "@ant-design/icons";

export default function () {

  const [avatarUser, setAvatarUser] = useState("/images/logo.png");
  const [nameUser, setNameUser] = useState("Nguyen Van A");
  const [chatWorkIdUser, setChatWorkIdUser] = useState(12345);
  const [emailUser, setEmailUser] = useState("nguyenvana@gmail.com");

  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <p
            className="title mb-11 ml-32"
            style={{ fontSize: "36px", marginBottom: "100px" }}
          >
            プロフィール
          </p>
          <div className="grid grid-cols-12 grid-rows-1 gap-2">
            <div className="row-span-1 col-span-3 justify-self-end">
              <Avatar
                size={150}
                style={{
                  backgroundColor: "#FFD802",
                  lineHeight: "100px",
                  marginRight: "60px",
                }}
                src={avatarUser}
              />
            </div>
            <div className="h-96 col-span-7 border-2 border-gray-300">
              <div className="grid grid-cols-3">
                <div className="col-start-3 pt-4 justify-self-center">
                  <div className="flex items-center gap-4 ">
                    <div>
                      <EditFilled className="border-2 rounded-full py-1 px-1 border-black" />
                    </div>
                    <a src="" className="text-blue-500">
                      プロファイル編集
                    </a>
                  </div>
                </div>
              </div>

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
                  <p>{emailUser}</p>
                </div>
              </div>
            </div>
          </div>
        </Otherlayout.Main>
      </Otherlayout>
    </>
  );
}
