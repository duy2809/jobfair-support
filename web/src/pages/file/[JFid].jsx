import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { Table, Checkbox, Button, notification, Breadcrumb, Empty, Modal, Tooltip, Form, Input } from 'antd'
import { FolderFilled, FileFilled } from '@ant-design/icons'
import './style.scss'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { ReactReduxContext } from 'react-redux'
import Search from '../../components/file/search'
import JfLayout from '../../layouts/JFLayout'
import { getLatest, getRootPathFile, deleteDocument, editDocument, getPath } from '../../api/file'
import ButtonAddFile from '../../components/file/ButtonAddFile'
import ButtonAddFolder from '../../components/file/ButtonAddFolder'
// TODO call API add file + folder + search + visit folder
export default function File() {
  const { store } = useContext(ReactReduxContext)
  const router = useRouter()
  const JFid = router.query.JFid
  const formatter = buildFormatter(frenchStrings)
  const [disableBtnEdit, setDisableBtnEdit] = useState(true)
  const [disableBtnDelete, setDisableBtnDelete] = useState(true)
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)
  const [isModalEditFileVisible, setIsModalEditFileVisible] = useState(false)
  const [isModalEditFolderVisible, setIsModalEditFolderVisible] = useState(false)
  const [directory, setDirectory] = useState(['ファイル'])
  const [currentRowIndex, setCurrentRowIndex] = useState(-1)
  const [isDisableEditFile, setIsDisableEditFile] = useState(false)
  const [isDisableEditFolder, setIsDisableEditFolder] = useState(false)
  const [isCheckAll, setIsCheckAll] = useState(false)

  const [formEditFile] = Form.useForm()
  const [formEditFolder] = Form.useForm()

  const user = store.getState().get('auth').get('user')

  const onEditFileChange = () => {
    const nameFile = formEditFile.getFieldValue('name_file')
    const link = formEditFile.getFieldValue('link')
    if (!nameFile || !link) {
      setIsDisableEditFile(true)
      return
    }
    setIsDisableEditFile(false)
  }
  const onChangeDisableEditFolder = () => {
    const nameFolder = formEditFolder.getFieldValue('name_folder')
    if (!nameFolder) {
      setIsDisableEditFolder(true)
      return
    }
    setIsDisableEditFolder(false)
  }

  // my code
  const [recentUpdated, setRecentUpdated] = useState([])
  const [data, setData] = useState([])
  const [isChecked, setIsChecked] = useState([])
  const columns = [
    {
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: '5%',
      render: (checkbox, record, rowIndex) => (
        <>
          {(!checkbox) || (
            <Checkbox
              checked={isChecked[rowIndex]}
              onChange={(e) => {
                setIsChecked((prev) => prev.map((el, i) => ((i === rowIndex) ? e.target.checked : el)))
              }}
            />
          )}
        </>
      ),
    },
    {
      title: <div className="ml-10">名前</div>,
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div
          onClick={async () => {
            if (record.is_file) {
              window.open(record.link)
            } else if (record.key !== -1) {
              let queryPath = ''
              for (let i = 0; i < directory.length; i += 1) {
                if (i !== 0) {
                  queryPath += `${directory[i]}/`
                } else {
                  queryPath += '/'
                }
              }
              queryPath += `${record.name}`
              const res = await getPath({
                params: {
                  jfId: JFid,
                  path: queryPath,
                },
              })

              const result = res.data.map((element) => ({
                key: element.id,
                checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
                is_file: element.is_file,
                name: element.name,
                updater: element.updaterName,
                updated_at: element.updated_at,
                link: element.link,
              }))
              setData(result)
              setIsCheckAll(false)
              setDirectory([...directory, record.name])
            } else {
              let queryPath = ''
              for (let i = 0; i < directory.length - 1; i += 1) {
                if (i !== 0 && i !== directory.length - 2) {
                  queryPath += `${directory[i]}/`
                } else if (i === 0) {
                  queryPath += '/'
                } else {
                  queryPath += directory[i]
                }
              }
              const res = await getPath({
                params: {
                  jfId: JFid,
                  path: queryPath,
                },
              })

              const result = res.data.map((element) => ({
                key: element.id,
                checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
                is_file: element.is_file,
                name: element.name,
                updater: element.updaterName,
                updated_at: element.updated_at,
                link: element.link,
              }))
              setData(result)
              setIsCheckAll(false)
              setDirectory(directory.slice(0, directory.length - 1))
            }
          }}
          className="cursor-pointer flex flex-row items-center"
        >
          {(record.is_file) ? <FileFilled className="mr-3" /> : <FolderFilled className="mr-3" />}
          {name.length > 20
            ? (
              <Tooltip placement="top" title={name}>
                <span
                  className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                  style={{ maxWidth: '20ch' }}
                >
                  {name}
                </span>
              </Tooltip>
            ) : (
              <span
                className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                style={{ maxWidth: '20ch' }}
              >
                {name}
              </span>
            )}
        </div>
      ),
    },
    {
      title: '更新者',
      dataIndex: 'updater',
      key: 'updater',
    },
    {
      title: '更新時間',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updatedAt) => (
        <>
          <TimeAgo date={updatedAt} formatter={formatter} />
        </>
      ),
    },
  ]
  useEffect(async () => {
    let res = await getRootPathFile(JFid)
    let result = res.data.map((element) => ({
      key: element.id,
      checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
      is_file: element.is_file,
      name: element.name,
      updater: element.updaterName,
      updated_at: element.updated_at,
      link: element.link,
    }))
    setData(result)
    res = await getLatest()
    result = res.data.map((element) => ({
      key: element.id,
      checkbox: true,
      is_file: element.is_file,
      name: element.name,
      updater: element.updaterName,
      updated_at: element.updated_at,
      link: element.link,
    }))
    setRecentUpdated(result)
  }, [])
  useEffect(() => {
    const temp = []
    for (let index = 0; index < data.length; index += 1) {
      temp.push(false)
    }
    setIsChecked(temp)
  }, [data])
  useEffect(() => {
    let count = 0
    isChecked.forEach((elem, index) => {
      if (elem && data[index].checkbox) {
        setCurrentRowIndex(index)
        count += 1
      }
    })
    if (count > 1) {
      setDisableBtnDelete(false)
      setDisableBtnEdit(true)
    } else if (count === 1) {
      setDisableBtnEdit(false)
      setDisableBtnDelete(false)
    } else {
      setDisableBtnEdit(true)
      setDisableBtnDelete(true)
    }
  }, [isChecked])
  useEffect(() => {
    if (directory.length !== 1) {
      setData([{
        key: -1,
        name: '..',
        checkbox: false,
        is_file: false,
        updater: '',
        updated_at: '',
        link: '',
      }, ...data])
    }
  }, [directory])
  const onBtnDeleteClick = () => {
    setIsModalDeleteVisible(true)
  }
  const onBtnEditClick = () => {
    if (data[currentRowIndex].is_file) {
      setIsModalEditFileVisible(true)
      formEditFile.setFieldsValue({
        name_file: data[currentRowIndex].name,
        link: data[currentRowIndex].link,
      })
    } else {
      formEditFolder.setFieldsValue({
        name_folder: data[currentRowIndex].name,
      })
      setIsModalEditFolderVisible(true)
    }
  }
  const handleEditFileOk = () => {
    const nameInput = formEditFile.getFieldValue('name_file')
    const linkInput = formEditFile.getFieldValue('link')
    editDocument(data[currentRowIndex].key, {
      name: nameInput,
      link: linkInput,
    }).then((res) => {
      if (res.data.name) {
        if (res.data.name[0] === 'The name has already been taken.') {
          formEditFile.setFields([
            {
              name: 'name_file',
              errors: ['このファイル名は既に使用されています。'],
            },
          ])
          setIsDisableEditFile(true)
          return
        }
      }
      notification.success({
        message: '成功に編集しました。',
        duration: 2,
      })
      const result = res.data.map((element) => ({
        key: element.id,
        checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
      }))
      if (directory.length > 1) {
        setData([{
          key: -1,
          name: '..',
          checkbox: false,
          is_file: false,
          updater: '',
          updated_at: '',
          link: '',
        }, ...result])
      } else setData(result)
      setIsModalEditFileVisible(false)
      setIsCheckAll(false)
    })
  }
  const handleEditFolderOk = () => {
    const nameInput = formEditFolder.getFieldValue('name_folder')
    editDocument(data[currentRowIndex].key, {
      name: nameInput,
    }).then((res) => {
      if (res.data.name) {
        if (res.data.name[0] === 'The name has already been taken.') {
          formEditFolder.setFields([
            {
              name: 'name_folder',
              errors: ['このフォルダ名は既に使用されています。'],
            },
          ])
          setIsDisableEditFolder(true)
          return
        }
      }
      notification.success({
        message: '成功に編集しました。',
        duration: 2,
      })
      const result = res.data.map((element) => ({
        key: element.id,
        checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
      }))
      if (directory.length > 1) {
        setData([{
          key: -1,
          name: '..',
          checkbox: false,
          is_file: false,
          updater: '',
          updated_at: '',
          link: '',
        }, ...result])
      } else setData(result)
      setIsModalEditFolderVisible(false)
      setIsCheckAll(false)
    })
  }
  const handleOkDelete = async () => {
    const idArray = []
    data.forEach((element, index) => {
      if (isChecked[index] && element.checkbox) idArray.push(element.key)
    })
    const res = await deleteDocument(JFid, { id: idArray })

    const result = res.data.map((element) => ({
      key: element.id,
      checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
      is_file: element.is_file,
      name: element.name,
      updater: element.updaterName,
      updated_at: element.updated_at,
      link: element.link,
    }))
    if (directory.length > 1) {
      setData([{
        key: -1,
        name: '..',
        checkbox: false,
        is_file: false,
        updater: '',
        updated_at: '',
        link: '',
      }, ...result])
    } else setData(result)
    setIsModalDeleteVisible(false)
    setIsCheckAll(false)
  }
  return (
    <div className="File">
      <JfLayout>
        <JfLayout.Main>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-x-12">
              <div className="md:col-span-5">
                <h1 className="text-3xl inline">ファイル</h1>
                <div className="w-full h-14 flex flex-row justify-end gap-x-6">
                  <ButtonAddFile
                    updater={user}
                    path={directory}
                    documentId={JFid}
                    setData={setData}
                    setIsCheckAll={setIsCheckAll}
                  />
                  <ButtonAddFolder
                    updater={user}
                    path={directory}
                    documentId={JFid}
                    setData={setData}
                    setIsCheckAll={setIsCheckAll}
                  />
                </div>
                <div className="w-full">
                  <div className="h-24 grid grid-cols-3 table-top border-t border-r border-l border-black rounded-t-md">
                    <div className="flex flex-col justify-center gap-2 pl-20 items-start col-span-2">
                      <Checkbox
                        className="w-100"
                        checked={isCheckAll}
                        onChange={(e) => {
                          setIsChecked((prev) => prev.map(() => e.target.checked))
                          setIsCheckAll(e.target.checked)
                        }}
                      >
                        全て選択
                      </Checkbox>
                      <Breadcrumb>
                        {directory.map((ele, index) => (
                          <Breadcrumb.Item
                            onClick={async () => {
                              let queryPath = ''
                              for (let i = 0; i <= index; i += 1) {
                                if (i !== index && i !== 0) {
                                  queryPath += `${directory[i]}/`
                                } if (i === 0) {
                                  queryPath += '/'
                                } else {
                                  queryPath += directory[i]
                                }
                              }
                              const res = await getPath({
                                params: {
                                  jfId: JFid,
                                  path: queryPath,
                                },
                              })

                              const result = res.data.map((element) => ({
                                key: element.id,
                                checkbox: ((user.get('id') === element.authorId) || (user.get('role') !== 'member')),
                                is_file: element.is_file,
                                name: element.name,
                                updater: element.updaterName,
                                updated_at: element.updated_at,
                                link: element.link,
                              }))
                              setData(result)
                              setIsCheckAll(false)
                              setDirectory(directory.slice(0, index + 1))
                            }}
                            className="underline text-xl cursor-pointer"
                          >
                            {ele}
                          </Breadcrumb.Item>
                        ))}
                      </Breadcrumb>
                    </div>
                    <div className="col-start-3 flex flex-row items-center justify-center gap-4">
                      <Button
                        type="primary"
                        className="w-14 md:w-24"
                        disabled={disableBtnEdit}
                        onClick={onBtnEditClick}
                      >
                        編集
                      </Button>
                      <Modal
                        title="新しいファイル"
                        okText="保存"
                        cancelText="キャンセル"
                        centered
                        visible={isModalEditFileVisible}
                        onOk={handleEditFileOk}
                        onCancel={() => { setIsModalEditFileVisible(false) }}
                        okButtonProps={{ disabled: isDisableEditFile }}
                      >
                        <Form
                          form={formEditFile}
                          onValuesChange={onEditFileChange}
                          layout="vertical"
                          name="basic"
                        >
                          <Form.Item
                            label={
                              <p>名前</p>
                            }
                            name="name_file"
                            rules={[
                              {
                                required: true,
                                message: 'この項目は必須です。',
                              }]}
                          >
                            <Input
                              type="text"
                              size="large"
                              placeholder="新しいファイル名"
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <p>リンク</p>
                            }
                            name="link"
                            rules={[
                              {
                                required: true,
                                message: 'この項目は必須です。',
                              }]}
                          >
                            <Input
                              type="text"
                              size="large"
                              placeholder="グーグルドライブリンク"
                            />
                          </Form.Item>
                        </Form>
                      </Modal>
                      <Modal
                        title="新しいフォルダ"
                        okText="保存"
                        cancelText="キャンセル"
                        centered
                        visible={isModalEditFolderVisible}
                        onOk={handleEditFolderOk}
                        onCancel={() => { setIsModalEditFolderVisible(false) }}
                        okButtonProps={{ disabled: isDisableEditFolder }}
                      >
                        <Form
                          form={formEditFolder}
                          onValuesChange={onChangeDisableEditFolder}
                          layout="vertical"
                          name="basic"
                        >
                          <Form.Item
                            label={
                              <p>名前</p>
                            }
                            name="name_folder"
                            rules={[
                              {
                                required: true,
                                message: 'この項目は必須です。',
                              }]}
                          >
                            <Input
                              type="text"
                              size="large"
                              placeholder="新しいフォルダ名"
                            />
                          </Form.Item>
                        </Form>
                      </Modal>
                      <Button
                        type="primary"
                        className="w-14 md:w-24"
                        disabled={disableBtnDelete}
                        onClick={onBtnDeleteClick}
                      >
                        削除
                      </Button>
                      <Modal
                        title="ファイルとフォルダを削除"
                        visible={isModalDeleteVisible}
                        onOk={handleOkDelete}
                        onCancel={() => { setIsModalDeleteVisible(false) }}
                        cancelText="いいえ"
                        okText="はい"
                      >
                        <p className="mb-5">削除してもよろしいですか？</p>
                      </Modal>
                    </div>
                  </div>
                  <Table
                    scroll={{ y: 1000 }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    // onRow={onRowClick}
                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="このフォルダは空です。" /> }}
                  />

                </div>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <div className="pt-12">
                  <h2 className="font-bold">最近更新されたファイル</h2>
                  <div className="h-60 recently mt-1 border border-black rounded-md flex flex-col justify-start">
                    {recentUpdated.map((el, index) => {
                      if (index !== recentUpdated.length - 1) {
                        return (
                          <>
                            <div className="my-2 px-6 border-b border-black ">
                              <div className="flex flex-row items-center">
                                <FileFilled className="mr-2 " />
                                {el.name.length > 20
                                  ? (
                                    <Tooltip placement="top" title={el.name}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {el.name}
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {el.name}
                                    </span>
                                  )}
                              </div>
                              <div className="py-2 flex flex-row items-center">
                                <TimeAgo date={el.updated_at} formatter={formatter} />

                                {el.updater.length > 20
                                  ? (
                                    <Tooltip placement="top" title={el.updater}>
                                      <span
                                        className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                        style={{ maxWidth: '20ch' }}
                                      >
                                        {' '}
                                        {` / ${el.updater}`}
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="text-sm inline-block whitespace-nowrap overflow-hidden overflow-ellipsis"
                                      style={{ maxWidth: '20ch' }}
                                    >
                                      {' '}
                                      {` / ${el.updater}`}
                                    </span>
                                  )}
                              </div>
                            </div>

                          </>
                        )
                      } return (
                        <>
                          <div className="my-2 px-6">
                            <FileFilled className="mr-2" />
                            {el.name}
                            <div className="py-2">
                              <TimeAgo date={el.updated_at} formatter={formatter} />
                              <span
                                className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                                style={{ maxWidth: '20ch' }}
                              >
                                {' '}
                                {` / ${el.updater}`}
                              </span>

                            </div>
                          </div>

                        </>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-5">
                  <h2 className="font-bold">ファイルを検索</h2>
                  <div className="mt-1 search pt-6 pr-6 pl-6 border border-black rounded-md">
                    <Search />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
File.middleware = ['auth:superadmin', 'auth:admin', 'auth']
