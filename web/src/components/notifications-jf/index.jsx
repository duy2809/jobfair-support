import React, { useState, useEffect } from 'react'
import { Button, Empty } from 'antd'
import Link from 'next/link'
import './style.scss'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { useScrollBy } from 'react-use-window-scroll'
import PropTypes from 'prop-types'
import { listupdate } from '../../api/jf-toppage'

const formatter = buildFormatter(frenchStrings)

const NotificationsJf = ({ id }) => {
  const [posts, setPost] = useState([])
  const fetchTasks = async () => {
    await listupdate(id).then((response) => {
      setPost(response.data.data[0].tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  const [tp, setTop] = useState(100)
  const scrollBy = useScrollBy()
  const [visi, setVisi] = useState(5)
  const showMoreItem = () => {
    setTop((to) => to + 100)
    setVisi((prevValue) => prevValue + 5)
    scrollBy({ top: tp, left: 0, behavior: 'smooth' })
  }
  const matItem = () => {
    if (visi > 5) { setVisi(5) }
    scrollBy({ top: 0, left: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="noti">
      <div className="table">
        {
          posts
            ? (
              <div>
                <div>
                  {posts.slice(0, visi).map((item) => (
                    <div href="/task-list" className="grid grid-cols-12 gap-4 table-item ">
                      <div className="col-span-6"><div className="item name"><h3><Link href={`/task-detai/${item.id}`}>{item.name}</Link></h3></div></div>
                      <div className="col-span-3"><div className="item username"><h4>{item.username}</h4></div></div>
                      <div className="col-span-3"><div className="item updated_at"><TimeAgo date={item.updated_at} formatter={formatter} /></div></div>

                    </div>
                  ))}
                </div>
                <div className="flex justify-center my-4 ...">
                  {(visi >= 5 && visi < 26) ? <Button className="more" type="primary" onClick={showMoreItem}>もっと見る</Button> : null }
                  {(visi > 5) ? <Button type="primary" onClick={matItem}>表示数を戻す</Button> : null}
                </div>
              </div>
            )
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }

      </div>

    </div>
  )
}

export default NotificationsJf
NotificationsJf.propTypes = {
  id: PropTypes.number.isRequired,
}