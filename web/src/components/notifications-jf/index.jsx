import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { listupdate } from '../../api/jf-toppage'
import './style.scss'
const NotificationsJf = () => {
  const [posts, setPost] = useState([])
  const fetchTasks = async () => {
    await listupdate().then((response) => {
      console.log(response.data.data[0].tasks,'hihi')
      setPost(response.data.data[0].tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  const [visi, setVisi] = useState(5)
  const showMoreItem = () => {
    setVisi((prevValue) => prevValue + 5)
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div>
      <div className="table">
        {posts.slice(0, visi).map((item) => (
          <div href="/task-list" className="grid grid-cols-12 gap-4 table-item ">
            <div className="col-span-6"><div className="item name"><h3>{item.name}</h3></div></div>
            <div className="col-span-3"><div className="item username"><h4>{item.username}</h4></div></div>
            <div className="col-span-3"><div className="item updated_at">{item.updated_at}</div></div>

          </div>
        ))}
      </div>
      <div className="flex justify-center my-4 ...">
        <Button type="primary" onClick={showMoreItem}>Loadmore</Button>
      </div>
    </div>
  )
}

export default NotificationsJf
