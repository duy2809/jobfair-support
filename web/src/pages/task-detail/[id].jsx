import React from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { Button, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
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
                <Button
                  style={{ border: 'none' }}
                  type="primary"
                  onClick={handleBack}
                >
                  戻る
                </Button>
              </div>
              <div className="button__right">
                {2 === 2 ? (
                  <>
                    <Button
                      style={{ border: 'none' }}
                      type="primary"
                      onClick={handleEdit}
                    >
                      編集
                    </Button>
                    <Button
                      style={{ border: 'none' }}
                      type="primary"
                      onClick={modelDelete}
                    >
                      削除
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
            <h1>タスク詳細</h1>
            <div className="info__tplt mx-6">
              <div className="grid grid-cols-2 mx-16 info__center">
                <div className="col-span-1 mx-4 ">
                  <div className="grid grid-cols-2 ">
                    <div className=" layber col-span-1 mx-4">
                      <p>テンプレートタスク名:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <div className="item__right">dfgdfg</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 ">
                  <div className="grid grid-cols-2 ">
                    <div className="layber  col-span-1 mx-4">
                      <p>カテゴリ:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <div className="item__right">sdgdfgdfg</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-2 ">
                    <div className="layber col-span-1 mx-4">
                      <p>マイルストーン:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <div className="item__right">555weet</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-2 ">
                    <div className="layber col-span-1 mx-4">
                      <p>工数:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <span className="ef">5555</span>
                      <span className="ef">sddfg</span>
                      <span>/</span>
                      <span className="ef">sfsdfdg</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-2 ">
                    <div className="layber col-span-1 mx-4">
                      <p>担当者:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <ul className="list__member">
                        <li>asdsfd</li>
                        <li>asfsdf</li>
                        {/* {beforeTasks ? beforeTasks.map((item) => (
                        <li className="task__chil">
                          <a href={`/tasks/${item.id}`} target="_blank" rel="noreferrer">
                            {truncate(item.name)}
                          </a>
                        </li>
                      )) : null } */}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-2 ">
                    <div className="layber col-span-1 mx-4">
                      <p>ステータス:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <span className="item__right">new</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-2 ">
                    <div className="layber col-span-1 mx-4">
                      <p>開始日:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <span className="item__right">2020/06/04</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-2 ">
                    <div className="layber col-span-1 mx-4">
                      <p>終了日:</p>
                    </div>
                    <div className="col-span-1 mx-4">
                      <span className="item__right">2020/06/04</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mx-16 mt-5">
                <div className="rela col-span-1 mx-8">
                  <p className="mb-2">前のタスク </p>
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
                <div className="rela col-span-1 mx-8">
                  <p className="mb-2">次のタスク</p>
                  <ul className="list__task">
                    {/* {1 ? afterTa1sks.map((item) => (
                      <li>
                        <a href={`/tasks/${item.id}`} target="_blank" rel="noreferrer">
                          {truncate(item.name)}
                        </a>
                      </li>
                    )) : null } */}
                  </ul>
                </div>
              </div>

              <div className="mx-16 mt-5">
                <div className=" mx-8 des demo-infinite-container">sdfdgf</div>
              </div>
            </div>

          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
