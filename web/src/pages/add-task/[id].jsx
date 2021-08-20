import React, { useEffect, useState } from 'react'
import { Tag, Form, Input, Space, Radio, Table, Select, Tooltip, Button, List, Avatar, Skeleton } from 'antd'
import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroller'
import OtherLayout from '../../layouts/OtherLayout'
import './style.scss'
import addTaskAPI from '../../api/add-task'

function index() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [listCatergories, setlistCatergories] = useState([])
  const [listMilestones, setlistMilestones] = useState([])
  const [templateTasks, settemplateTasks] = useState([])
  const [dataTable, setdataTable] = useState([])
  const [loading, setloading] = useState(true)
  const [jobfair, setJobfair] = useState([])
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const jobfairInfo = await addTaskAPI.getJobfair(router.query.id)
        const categories = await addTaskAPI.getCategories()
        const milestones = await addTaskAPI.getMilestones()
        const tasks = await addTaskAPI.getAllTemplateTasks()
        setlistCatergories((categories.data))
        setlistMilestones(Array.from(milestones.data))
        setJobfair((jobfairInfo.data))
        settemplateTasks(Array.from(tasks.data))
        setloading(false)
        return null
      } catch (error) {
        return Error(error.toString())
      }
    }
    fetchAPI()
  }, [])

  const columns = [{
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  }]

  const filter = () => {
    console.log(form.getFieldValue())
    const selectedFilter = form.getFieldsValue()
    // const milestoneFilter = form.getFieldsValue().milestones
    // console.log(categoryFilter)
    // let selectedFilter = []
    // if (categoryFilter && !milestoneFilter) {
    //   selectedFilter = [...selectedFilter, ...categoryFilter]
    // } else if (!categoryFilter && milestoneFilter) {
    //   selectedFilter = [...selectedFilter, ...milestoneFilter]
    // } else if (categoryFilter && milestoneFilter) {
    //   selectedFilter = [...categoryFilter, ...milestoneFilter]
    // }

    const filtedData = templateTasks.filter((item) => {
      if (!selectedFilter.category && selectedFilter.milestone) {
        if (item.milestone.id === selectedFilter.milestone) {
          console.log(item.id)
          return { }
        }
      } else if (selectedFilter.category && !selectedFilter.milestone) {
        for (let i = 0; i < item.categories.length; i += 1) {
          const element = item.categories[i]
          if (element.id === selectedFilter.category) {
            return item
          }
        }
      } else {
        const both = []
        if (item.milestone.id === selectedFilter.milestone) {
          both.push(item)
        }
        for (let i = 0; i < item.categories.length; i += 1) {
          const element = item.categories[i]
          if (element.id === selectedFilter.category) {
            console.log(element.name, element.id)
          }
        }
        return both
      }
    })
    setdataTable(filtedData)
    console.log(filtedData)

    // setdataTable(filtedData)
  }

  return (
    <OtherLayout>
      <OtherLayout.Main>

        <div className="add-task-page">
          <div className="page-title">
            <h1>
              夕スク登録
              <Tag
                className="ml-4 text-sm p-1 "
                color="#55acee"
                icon={loading ? <SyncOutlined spin /> : ''}
              >
                {loading ? 'processing' : jobfair.name}
              </Tag>
            </h1>

          </div>
          <div className="container mx-auto w-3/4">
            <div className="grid grid-cols-1 grid-flow-row justify-center">

              {/* task header */}
              <div className="header flex justify-between mb-6 " style={{ flex: '0 0 100%' }}>
                <Form className="flex justify-between w-full" form={form}>
                  <div className="filter" style={{ flex: '0 0 70%' }}>
                    <Space size={20} className="w-full pr-20">
                      <Form.Item label="" name="category" className="w-full">
                        <Select
                          showSearch
                          size="large"
                          showArrow
                          allowClear
                          className="w-100"
                          placeholder="カテゴリ"
                          onChange={filter}
                        >
                          {listCatergories.map((element) => (
                            <Select.Option key={element.id} value={element.id}>
                              {element.category_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item label="" name="milestone">
                        <Select
                          showSearch
                          size="large"
                          showArrow
                          allowClear
                          onChange={filter}
                          className="w-100"
                          placeholder="マイルストーン"
                        //   onChange={filterSelectedTasks}
                        >
                          {listMilestones.map((element) => (
                            <Select.Option key={element.id} value={element.id}>
                              {element.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Space>
                  </div>
                  <div className="search-input">
                    <Input
                      size="large"
                      className="search-input"
                      allowClear="true"
                      prefix={<SearchOutlined />}
                      placeholder="テンプレートタスク名"

                    />
                  </div>
                </Form>
              </div>
              {/* list body */}
              <div className="list-task rounded-sm border border-gray-300 mb-8">

                <Table
                  rowSelection
                  // {...this.state}
                  pagination={false}
                  columns={columns}
                  dataSource={dataTable}
                  // scroll={scroll}
                />
              </div>
              {/* 2 button */}
              <div className="data-controller mr-5">
                <Space size={20} className="flex justify-end">
                  <Button
                    htmlType="button"
                    className="ant-btn"
                    // onClick={cancelConfirmModle}
                    // disabled={disableBtn}
                    // loading={disableBtn}
                  >
                    キャンセル
                  </Button>
                  {/* --------------------------- */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    // disabled={disableBtn}
                    // loading={disableBtn}
                    style={{ letterSpacing: '-1px' }}
                  >
                    登録
                  </Button>
                </Space>
              </div>
            </div>
          </div>

        </div>
      </OtherLayout.Main>
    </OtherLayout>
  )
}

export default index
