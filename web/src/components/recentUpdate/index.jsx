/* eslint-disable no-nested-ternary */
import { Divider, List, Avatar, Button, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import PropTypes from 'prop-types'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { getJobfairComment } from '../../api/comment'
import './style.scss'
import CommentChannel from '../../libs/echo/channels/comment-channel'

function RecentUpdate(props) {
  // const [initLoading, setInitLoading] = useState(true)
  // const [loading, setLoading] = useState(false)
  const [start, setStart] = useState(0)
  const [list, setList] = useState([])

  const changeFormat = (date) => {
    const temp = new Date(date)
    const year = temp.getUTCFullYear()
    const month = temp.getUTCMonth() + 1
    const day = temp.getUTCDate()
    const time = `${year}年${month}月${day}日`
    return time
  }
  const formatter = buildFormatter(frenchStrings)
  const addData = (data) => {
    // setInitLoading(false)
    const newList = list.concat(data)
    let currentDate = ''
    newList.forEach((element) => {
      const date = new Date(element.last_edit).toLocaleDateString()
      if (date !== currentDate) {
        element.isFirstOfDay = true
        currentDate = date
      } else {
        element.isFirstOfDay = false
      }
    })
    setList(newList)
    // setStart(start + 5)
  }
  useEffect(async () => {
    setList([])
    getJobfairComment(props.JFid, start, 5).then((response) => {
      addData(response.data)
    })
    new CommentChannel()
      .listen((data) => {
        setList((prev) => {
          let newList = [...prev]
          if (props.JFid === 'all' || data.jobfair_id.toString() === props.JFid.toString()) {
            console.log([data, ...newList])
            newList = [data, ...newList]
            console.log(newList)

            let currentDate = ''
            newList.forEach((element) => {
              const date = new Date(element.last_edit).toLocaleDateString()
              if (date !== currentDate) {
                element.isFirstOfDay = true
                currentDate = date
              } else {
                element.isFirstOfDay = false
              }
            })
          }
          return newList
        })
      })
  }, [])
  // const data = [q
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: true,
  //   },
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: false,
  //   },
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: false,
  //   },
  //   {
  //     title: "木村さんがタスクを追加",
  //     display: true,
  //   },
  // ];
  const onLoadMore = async () => {
    await getJobfairComment(props.JFid, start + 5, 5).then((response) => {
      addData(response.data)
    })
    setStart(start + 5)
  }
  const loadMore = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={onLoadMore}>もっと読む</Button>
    </div>
  )
  return (
    <div className="recent-update">
      <h1 className="mt-8">最近の更新</h1>
      <List
        className="my-3"
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <>
            {item.isFirstOfDay && (
              <Divider orientation="center">{changeFormat(item.last_edit)}</Divider>
            )}
            <List.Item className="border hover:border-black">
              <List.Item.Meta
                avatar={(
                  <>
                    {item.author?.avatar === 'images/avatars/default.jpg' ? (
                      <Avatar src="../images/avatars/default.jpg" />
                    ) : (
                      <>
                        <Avatar
                          src={`${process.env.APP_URL}/api/avatar/${item.author.id}`}
                        />
                      </>
                    )}
                  </>
                )}
                title={(
                  <>
                    <a href="">{item.author.name}</a>
                    {item.is_created_task ? (
                      <span>さんがタスクを追加</span>
                    ) : item.is_normal_comment ? (<span>がタスクにコメント</span>) : (
                      <span>さんがタスクを更新</span>
                    )}
                  </>
                )}
                description={(
                  <>
                    <a href={`/task-detail/${item.task.id}`}>{item.task.name}</a>
                    <p>{item.content}</p>
                    {(item.old_name || item.new_name) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            タスク名：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_name}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_name}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {(item.old_status || item.new_status) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            ステータス：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_status}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_status}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {(item.old_start_date || item.new_start_date) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            開始日：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_start_date}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_start_date}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {(item.old_end_date || item.new_end_date) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            終了日：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_end_date}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_end_date}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {(item.old_assignees.length > 0
                      || item.new_assignees.length > 0) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            担当者：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_assignees.join(', ')}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_assignees.join(', ')}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {(item.old_previous_tasks.length > 0
                      || item.new_previous_tasks.length > 0) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            前のタスク：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_previous_tasks.join(', ')}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_previous_tasks.join(', ')}
                          </Typography>
                        </div>
                      </div>
                    )}

                    {(item.old_following_tasks.length > 0
                      || item.new_following_tasks.length > 0) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            次のタスク：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_following_tasks.join(', ')}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_following_tasks.join(', ')}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {(item.old_reviewers.length > 0
                      || item.new_reviewers.length > 0) && (
                      <div className="flex">
                        <div className="old__status flex">
                          <strong
                            className="text-right"
                            style={{ minWidth: '90px' }}
                          >
                            レビュアー：
                          </strong>
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.old_reviewers.join(', ')}
                          </Typography>
                        </div>
                        &rArr;
                        <div className="new__status">
                          <Typography className="bg-black-600  text-[#888888] text-sm px-2 italic ">
                            {item.new_reviewers.join(', ')}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
              <div>
                {' '}
                <TimeAgo date={item.last_edit} formatter={formatter} />
              </div>
            </List.Item>
          </>
        )}
      />
      {/* <Divider orientation="center">10/11/2021</Divider>
        <List
          className="my-3"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        /> */}
    </div>
  )
}
RecentUpdate.propTypes = {
  JFid: PropTypes.isRequired,
}
export default RecentUpdate
