import React, { useState, useEffect } from 'react'
import { Table, Checkbox, Button, notification, Divider, Breadcrumb } from 'antd'
import { FolderFilled, FileFilled } from '@ant-design/icons'
import './style.scss'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import Search from '../../components/file/search'
import JfLayout from '../../layouts/JFLayout'

export default function File() {
  const formatter = buildFormatter(frenchStrings)
  const [disableBtnEdit, setDisableBtnEdit] = useState(true)
  const [disableBtnDelete, setDisableBtnDelete] = useState(true)
  const [isLoadingBtnEdit, setIsLoadingEdit] = useState(false)
  const [isLoadingBtnDelete, setIsLoadingBtnDelete] = useState(false)
  const [directory, setDirectory] = useState(['ファイル', 'abc', 'dsaffdsfadsf', 'dsfsfdsafsadf'])
  const [recentUpdated, setRecentUpdated] = useState([
    {
      key: '0',
      checkbox: true,
      name: 'abc.jpg',
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
      name: 'abc.jpg',
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
        <>
          {(record.is_file) ? <FileFilled className="mr-3" /> : <FolderFilled className="mr-3" />}
          {name}
        </>
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
    console.log(count)
  }, [isChecked])
  const onBtnDeleteClick = () => {
    console.log('x')
  }
  const onBtnEditClick = () => {
    console.log('x')
  }
  const onClickDirectory = (e) => {
    console.log(e.target)
  }
  const onRowClick = (record, rowIndex) => ({
    onClick: (event) => {
      console.log(record)
    }, // click row

  })
  return (
    <div className="File">
      <JfLayout>
        <JfLayout.Main>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-x-12">
              <div className="md:col-span-5">
                <h1 className="text-3xl float-left">ファイル</h1>
                <div className="w-full h-14 mt-16">
                  <Button>Add file</Button>
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
                        loading={isLoadingBtnEdit}
                        onClick={onBtnEditClick}
                      >
                        編集
                      </Button>
                      <Button
                        type="primary"
                        className="w-14 md:w-24"
                        disabled={disableBtnDelete}
                        loading={isLoadingBtnDelete}
                        onClick={onBtnDeleteClick}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                  <Table
                    scroll={{ y: 1000 }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    onRow={onRowClick}
                  />

                </div>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <div className="pt-12">
                  <h2 className="font-bold">最近更新されたファイル</h2>
                  <div className="h-60 recently mt-4 border border-black rounded-md flex flex-col justify-start">
                    {recentUpdated.map((el, index) => {
                      if (index !== recentUpdated.length - 1) {
                        return (
                          <>
                            <div className="my-2 px-6 border-b border-black">
                              <FileFilled className="mr-2" />
                              {el.name}
                              <div className="py-2">
                                <TimeAgo date={el.updated_at} formatter={formatter} />
                                {` / ${el.updater}`}

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
                              {` / ${el.updater}`}

                            </div>
                          </div>

                        </>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-7">
                  <h2 className="font-bold">ファイルを検索</h2>
                  <div className="mt-4 search pt-6 pr-6 pl-6 border border-black rounded-md">
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
