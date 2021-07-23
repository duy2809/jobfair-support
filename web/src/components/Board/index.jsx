import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd'
import './index.scss'
import Link from 'next/link'

export default function Board({ data }) {
  return (
    <List
      itemLayout="horizontal"
      className="w-8/12 flex justify-between items-center rounded-3xl board my-5"
      bordered
      dataSource={data}
      renderItem={(item) => (
        <Link href="#">
          <List.Item className="text-xl text-black-paragraph board-list-item__styled">
            <div>{item.name}</div>
          </List.Item>
        </Link>
      )}
    />
  )
}

Board.propTypes = {
  data: PropTypes.array.isRequired,
}
