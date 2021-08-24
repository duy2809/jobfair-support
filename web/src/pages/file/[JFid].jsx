import React, { useState, useEffect } from 'react'
import { Table, Checkbox, Button, notification, Divider, Breadcrumb, Empty, Modal, Tooltip, Form, Input } from 'antd'
import { FolderFilled, FileFilled } from '@ant-design/icons'
import './style.scss'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import Search from '../../components/file/search'
import JfLayout from '../../layouts/JFLayout'
// TODO call API + visit the exactly link of file + Modal Edit + handle file name and directory name too long
export default function File() {
  const formatter = buildFormatter(frenchStrings)
  const [disableBtnEdit, setDisableBtnEdit] = useState(true)
  const [disableBtnDelete, setDisableBtnDelete] = useState(true)
  const [isLoadingBtnEdit, setIsLoadingEdit] = useState(false)
  const [isLoadingBtnDelete, setIsLoadingBtnDelete] = useState(false)
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)
  const [isModalEditVisible, setIsModalEditVisible] = useState(false)
  const [directory, setDirectory] = useState(['ファイル', 'abc', 'dsaffdsfadsf', 'dsfsfdsafsadf'])
  // tu's code
  const [isDisableFile, setIsDisableFile] = useState(true)
  const [isDisableFolder, setIsDisableFolder] = useState(true)

  const [isModalAddVisible, setIsModalAddVisible] = useState({
    addFile: false,
    addFolder: false,
  })
  const [formFile] = Form.useForm()
  const [formFolder] = Form.useForm()

  const handleAddFileCancel = () => {
    formFile.setFieldsValue({ name_file: '', link: '' })
    formFolder.setFieldsValue({ name_folder: '' })
    setIsModalAddVisible({ addFile: false, addFolder: false })
  }
  const onFileChange = () => {
    const nameFile = formFile.getFieldValue('name_file')
    const link = formFile.getFieldValue('link')
    if (!nameFile || !link) {
      setIsDisableFile(true)
      return
    }
    setIsDisableFile(false)
  }

  const onChangeDisableFolder = () => {
    const nameFolder = formFolder.getFieldValue('name_folder')
    if (!nameFolder) {
      setIsDisableFolder(true)
      return
    }
    setIsDisableFolder(false)
  }

  // my code
  const [recentUpdated, setRecentUpdated] = useState([
    {
      key: '0',
      checkbox: true,
      name: '1abc.jpgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      is_file: false,
      updater: 'vu phongaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '1',
      checkbox: false,
      is_file: false,
      name: '0abdsfac',
      updater: 'vu phong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '2',
      checkbox: false,
      is_file: true,
      name: 'fdsfasabc.jpg',
      updater: 'vu phongdsf',
      updated_at: '2021-08-20 10:16:15',
    },
    {
      key: '3',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '4',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '5',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '6',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '7',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '8',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '9',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
    },
  ])
  const [data, setData] = useState([
    {
      key: '0',
      checkbox: true,
      name: '1abc.jpgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      is_file: false,
      updater: 'vu phong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '1',
      checkbox: false,
      is_file: false,
      name: '0abdsfac',
      updater: 'vu phong',
      updated_at: '2021-08-20 03:16:15',
    },
    {
      key: '2',
      checkbox: false,
      is_file: true,
      name: 'fdsfasabc.jpg',
      updater: 'vu phongdsf',
      updated_at: '2021-08-20 10:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',
    },
    {
      key: '3',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',
    },
    {
      key: '4',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',
    },
    {
      key: '5',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '6',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '7',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '8',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
    {
      key: '9',
      checkbox: true,
      is_file: true,
      name: 'dfsafdsabc',
      updater: 'vu pfdsahong',
      updated_at: '2021-08-20 03:16:15',
      link: 'https://stackoverflow.com/questions/65632698/how-to-open-a-link-in-a-new-tab-in-nextjs',

    },
  ])
  const temp = []
  for (let index = 0; index < data.length; index += 1) {
    temp.push(false)
  }
  const [isChecked, setIsChecked] = useState(temp)
  const columns = [
    {
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: '5%',
      render: (checkbox, record) => (
        <>
          {(!checkbox) || (
            <Checkbox
              checked={isChecked[record.key]}
              onChange={(e) => {
                setIsChecked((prev) => prev.map((el, i) => ((i === parseInt(record.key, 10)) ? e.target.checked : el)))
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
          onClick={() => {
            if (record.is_file) {
              window.open(record.link)
            } else {
              // TODO fetch new folder API
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
  useEffect(() => {
    let count = 0
    isChecked.forEach((elem, index) => {
      if (elem && data[index].checkbox) count += 1
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
  const onBtnDeleteClick = () => {
    setIsModalDeleteVisible(true)
  }
  const onBtnEditClick = () => {
    console.log('x')
  }
  const onClickDirectory = (e) => {
    console.log(e.target)
  }
  // const onRowClick = (record) => ({
  //   onClick: () => {
  //     if (record.is_file) {
  //       window.open(record.link)
  //     } else {
  //       // TODO fetch new folder API
  //     }
  //   }, // click row

  // })
  const handleOkDelete = () => {

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
                  <Button
                    type="primary"
                    size="large"
                    className="h-10"
                    icon={<FileFilled />}
                    onClick={() => setIsModalAddVisible((prevState) => ({
                      ...prevState,
                      addFile: true,
                    }))}
                  >
                    新しいファイル
                  </Button>
                  <Modal
                    title="新しいファイル"
                    okText="保存"
                    cancelText="キャンセル"
                    centered
                    visible={isModalAddVisible.addFile}
                    onCancel={handleAddFileCancel}
                    okButtonProps={{ disabled: isDisableFile }}
                  >
                    <Form
                      form={formFile}
                      onValuesChange={onFileChange}
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
                  <Button
                    type="primary"
                    size="large"
                    className="h-10"
                    icon={<FolderFilled />}
                    onClick={() => setIsModalAddVisible((prevState) => ({
                      ...prevState,
                      addFolder: true,
                    }))}
                  >
                    新しいフォルダ
                  </Button>
                  <Modal
                    title="新しいフォルダ"
                    okText="保存"
                    cancelText="キャンセル"
                    centered
                    visible={isModalAddVisible.addFolder}
                    onCancel={handleAddFileCancel}
                    okButtonProps={{ disabled: isDisableFolder }}
                  >
                    <Form
                      form={formFolder}
                      onValuesChange={onChangeDisableFolder}
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
                </div>
                <div className="w-full">
                  <div className="h-24 grid grid-cols-3 table-top border-t border-r border-l border-black rounded-t-md">
                    <div className="flex flex-col justify-center gap-2 pl-20 items-start col-span-2">
                      <Checkbox
                        className="w-100"
                        onChange={(e) => {
                          setIsChecked((prev) => prev.map(() => e.target.checked))
                        }}
                      >
                        全て選択
                      </Checkbox>
                      <Breadcrumb>
                        {directory.map((ele) => (
                          <Breadcrumb.Item onClick={onClickDirectory} className="underline text-xl cursor-pointer">
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
