import React, { useState, useEffect } from 'react'
import { Button } from 'antd'

import { listupdate } from '../../api/jf-toppage'

const NotificationsJf = () => {
  const [posts, setPost] = useState([])
  const fetchTasks = async () => {
    await listupdate().then((response) => {
      setPost(response.data.data[0].tasks)
      console.log(posts, 'post')
    }).catch((error) => {
      console.log(error)
    })
  }
  const [visi, setVisi] = useState(3)
  const showMoreItem = () => {
    setVisi((prevValue) => prevValue + 3)
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div>
      {posts.slice(0, visi).map((item) => (
        <>
          <div>{item.name}</div>
          <div>{item.created_at}</div>
          <div>{item.username}</div>
        </>

      ))}
      <Button onClick={showMoreItem}>Loadmore</Button>
    </div>
  )
}

export default NotificationsJf
