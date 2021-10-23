import React, { useState, useEffect, useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Avatar, Divider, Typography, Popover } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import moment from 'moment'
import * as deleteCommentAPI from '../../api/comment'
import PropTypes from 'prop-types'
import './styles.scss'

function Comment(props) {
  const AVATAR_SIZE = 50
  const MAX_CHAR_PER_LINE = 112
  const [expanded, setExpanded] = useState(false)
  const [commentOverflow, setCommentOverflow] = useState(false)
  const { store } = useContext(ReactReduxContext)
  const [userId, setUserId] = useState(1)

  const classNames = (...classes) => classes.filter(Boolean).join(' ')

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setUserId(store.getState().get('auth').get('user').get('id'))
    setCommentOverflow(props.content.length > MAX_CHAR_PER_LINE)
  }, [])

  const editComment = () => {
    console.log('Edit')
  }
  const deleteComment = async () => {
    const response = await deleteCommentAPI.deleteComment(props.id)
  }

  return (
    <div className="comment">
      <div className="flex flex-row ">
        <div>
          <Avatar
            className="mr-4 inline-block"
            size={AVATAR_SIZE}
            src={`${process.env.APP_URL}/api/avatar/${props.author.id}`}
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between">
            <div className="flex gap-4">
              <span className="comment__author">{props.author.name}</span>
              <span className="comment__time">
                {moment(props.created).format('YYYY/MM/DD HH:mm:ss')}
              </span>
            </div>
            <div className="mr-4" hidden={userId !== props.author.id}>
              <EditTwoTone
                className="border-none mx-1 text-2xl"
                type="primary"
                onClick={editComment}
              />
              <DeleteTwoTone
                className="border-none mx-1 text-2xl"
                type="primary"
                onClick={deleteComment}
              />
            </div>
          </div>
          <div className={classNames('flex flex-1 gap-4', expanded ? 'flex-col' : 'flex-row')}>
            <span
              className={classNames(
                'comment__content',
                expanded ? 'expanded' : 'collapse',
                commentOverflow ? 'comment__overflow' : ''
              )}
            >
              {props.content}
            </span>
            <div>
              <Typography.Link className="mr-4 see-more" onClick={toggleExpanded}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {expanded ? '閉じる' : commentOverflow ? 'もっと読む' : ''}
              </Typography.Link>
              <Popover
                content={moment(props.lastEdit).format('YYYY/MM/DD HH:mm:ss')}
                trigger="hover"
              >
                <span className="comment__edited text-gray-500 italic" hidden={!props.edited}>
                  編集済み
                </span>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <Divider className="mx-2 bg-gray-300" />
    </div>
  )
}
Comment.propTypes = {
  id: PropTypes.number.isRequired,
  author: PropTypes.object.isRequired,
  created: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  edited: PropTypes.bool.isRequired,
  lastEdit: PropTypes.string.isRequired,
}

export default Comment
