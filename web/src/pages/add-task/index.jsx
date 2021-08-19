import React, { useEffect, useState } from 'react'
import { Tag, Form, Input, Space, Empty, Select, Tooltip, Button, List, Avatar, Skeleton } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroller'
import OtherLayout from '../../layouts/OtherLayout'
import './style.scss'

function index() {
  return (
    <OtherLayout>
      <OtherLayout.Main>

        <div className="add-task-page">
          <div className="page-title">
            <h1>
              夕スク登録
              <Tag className="ml-4" color="#55acee">
                JF:
                test
              </Tag>
            </h1>

          </div>
          <div className="container mx-auto w-3/4">
            <div className="grid grid-cols-1 grid-flow-row justify-center">

              {/* task header */}
              <div className="header flex justify-between mb-6 " style={{ flex: '0 0 100%' }}>
                <Form className="flex justify-between w-full">
                  <div className="filter" style={{ flex: '0 0 70%' }}>
                    <Space size={20} className="w-full pr-20">
                      <Form.Item label="" name="category" className="w-full">
                        <Select
                          showSearch
                          size="large"
                          showArrow
                          allowClear
                          className="w-100"
                          placeholder="リレーション"
                        //   onChange={filterSelectedTasks}
                        >
                          {/* {templateTasks.map((element) => (
                            <Select.Option key={element.id} value={element.id}>
                              {element.name}
                            </Select.Option>
                          ))} */}
                        </Select>
                      </Form.Item>
                      <Form.Item label="" name="milestone">
                        <Select
                          showSearch
                          size="large"
                          showArrow
                          allowClear
                          //   tagRender={tagRender}
                          //   value={selectedItems}
                          className="w-100"
                          placeholder="リレーション"
                        //   onChange={filterSelectedTasks}
                        >
                          {/* {templateTasks.map((element) => (
                            <Select.Option key={element.id} value={element.id}>
                              {element.name}
                            </Select.Option>
                          ))} */}
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
                <InfiniteScroll
                  className="min-h-full min-w-full "
                  initialLoad={false}
                  pageStart={0}
                >
                  <List
                    className="lazyload-list"
                    // loading={initLoading}
                    itemLayout="horizontal"
                    // loadMore={loadMore}
                    // dataSource={list}
                    renderItem={(item) => (
                      <List.Item
                        actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                      >
                        <Skeleton avatar title={false} loading={item.loading} active>
                          <List.Item.Meta
                            avatar={
                              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={<a href="https://ant.design">{item.name.last}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                          />
                          <div>content</div>
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
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
