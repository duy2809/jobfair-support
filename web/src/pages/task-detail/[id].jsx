import React from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { Button, Modal } from 'antd'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import OtherLayout from '../../layouts/OtherLayout'

export default function TaskList() {
  const router = useRouter()
  const idTask = router.query.id
  console.log(idTask)
  const deletetpl = async () => {
    // await deleteTptt(idTplt).then((response) => {
    //   console.log(response.data)
    //   saveNotification()
    //   router.push('/template-tasts')
    // }).catch((error) => {
    //   console.log(error)
    // })
  }
  const modelDelete = () => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deletetpl()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  const handleBack = () => {
    router.push('/template-tasts')
  }
  const handleEdit = () => {
    router.push('/template-tasts')
  }
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="task-details">
            <div className="list__button">
              <div className="button__left">
                <Button style={{ border: 'none' }} type="primary" onClick={handleBack}>戻る</Button>
              </div>
              <div className="button__right">
                {2 === 2 ? (
                  <>
                    <Button style={{ border: 'none' }} type="primary" onClick={handleEdit}>編集</Button>
                    <Button style={{ border: 'none' }} type="primary" onClick={modelDelete}>削除</Button>
                  </>
                )
                  : null}
              </div>
            </div>
            <h1>タスク詳細</h1>
            <div className="info__tplt">
              <div className="info__center">
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className=" layber col-span-2 ">
                    <p>タスク名:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">dfgfg</div>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className="layber col-span-2 ">
                    <p>カテゴリ:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">dfgdfg</div>
                  </div>
                  <div className="col-span-2 " />
                </div>

                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>マイルストーン:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">dfgdfg</div>
                  </div>
                  <div className="col-span-2 " />
                </div>

                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>リレーション:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="rela">
                      <p>前のタスク </p>
                      <ul className="list__task" />

                    </div>
                    <div className="rela">
                      <p>次のタスク</p>
                      <ul className="list__task" />
                    </div>
                  </div>
                  <div className="col-span-2 " />
                </div>

                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>工数:</p>
                  </div>
                  <div className="col-span-3">
                    <span className="ef">dfgdfg</span>
                    <span className="ef">dfgdfg</span>
                    <span>/</span>
                    <span className="ef">dfgdfg</span>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>詳細:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="des demo-infinite-container">
                      fgfg
                    </div>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className=" layber col-span-2 ">
                    <p>担当者:</p>
                  </div>
                  <div className="col-span-3">
                    <ul className="list__task">
                      {/* {beforeTasks ? beforeTasks.map((item) => (
                        <li className="task__chil">
                          <a href={`/tasks/${item.id}`} target="_blank" rel="noreferrer">
                            {truncate(item.name)}
                          </a>
                        </li>
                      )) : null } */}
                    </ul>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className=" layber col-span-2 ">
                    <p>ステータス:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">new</div>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className=" layber col-span-2 ">
                    <p>開始日:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">2020/06/04</div>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className=" layber col-span-2 ">
                    <p>終了日:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">2020/06/04</div>
                  </div>
                  <div className="col-span-2 " />
                </div>
              </div>
            </div>
          </div>

        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
