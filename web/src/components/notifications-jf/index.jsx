import React, { useEffect, useState } from 'react'
import { List, Button } from 'antd'
import './style.scss'
import { listupdate } from '../../api/jf-toppage'

export default function NotificationsJf() {
  const [listUpdate, setlistUpdate] = useState({})
  const fetchListUpdate = async () => {
    await listupdate().then((response) => {
      setlistUpdate(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    fetchListUpdate()
  }, [])
  console.log(listUpdate)

  const data = [
    {
      title: 'タスク名',
      description: '更新者名 ',
      time: '2022/22/22',
    },
    {
      title: 'タスク名',
      description: '更新者名 ',
      time: '2022/22/22',
    },
    {
      title: 'タスク名',
      description: '更新者名 ',
      time: '2022/22/22',
    },
    {
      title: 'タスク名',
      description: '更新者名 ',
      time: '2022/22/22',
    },
  ]
  const ShowMore = () => {
    console.log('click')
  }
  return (
    <div className="notiJf">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<span>{item.title}</span>}
              description={<span>{item.description}</span>}
            />
            <div className="time">{item.time}</div>
          </List.Item>
        )}
      />
      <div className="my-4 flex justify-center ..."><Button onClick={ShowMore} size="large" type="primary">Show more</Button></div>

    </div>
  )
}
