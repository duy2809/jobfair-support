import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd'
import './styles.scss'
import Link from 'next/link'
import { formatDate } from '~/utils/utils'

export default function Board({ data, isLoading }) {
  return (
    <List
      itemLayout="horizontal"
      className="w-10/12 rounded-3xl board-responsive my-5"
      bordered
      loading={isLoading}
      dataSource={data}
      header={(
        <div className=" text-xl font-bold justify-between items-center flex header-bottom">
          <div className="w-8">No.</div>
          <div className="w-1/4 text-left">フルネーム </div>
          <div className="w-1/4">フルネーム</div>
          <div>参加日</div>
        </div>
      )}
      renderItem={(item, index) => (
        <Link href="#">
          <List.Item className="text-xl font-bold border-bottom-styled">
            <div className="w-4">{index + 1}</div>
            <div className="w-1/3">{item.name}</div>
            <div className="w-1/3">{item.email}</div>
            <div>{formatDate(item.created_at)}</div>
          </List.Item>
        </Link>
      )}
    />
  )
}

Board.propTypes = {
  data: PropTypes.array.isRequired,
}
