import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd'
import './styles.scss'
import Link from 'next/link'

export default function Board3({ data }) {
  return (
    <List
      itemLayout="horizontal"
      className="w-10/12 rounded-3xl board-responsive my-5 mb-96 "
      bordered
      dataSource={data}
      header={(
        <div className=" text-xl font-bold justify-between items-center flex header-bottom">
          <div>No.</div>
          <div className="mr-6">フルネーム </div>
          <div className="mr-32">フルネーム</div>
          <div className="mr-5">参加日</div>
        </div>
      )}
      renderItem={(item) => (
        <Link href="#">
          <List.Item className="text-xl font-bold border-bottom-styled">
            <div>{item.Stt}</div>
            <div className="w-12">{item.Name}</div>
            <div>{item.Email}</div>
            <div>{item.Time}</div>
          </List.Item>
        </Link>
      )}
    />
  )
}

Board3.propTypes = {
  data: PropTypes.array.isRequired,

}
