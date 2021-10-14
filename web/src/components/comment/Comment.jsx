import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Typography, Popover } from 'antd'
import PropTypes from 'prop-types'
import './styles.scss'

function Comment(props) {
  const AVATAR_SIZE = 50
  const MAX_CHAR_PER_LINE = 112
  const [expanded, setExpanded] = useState(false)
  const [commentOverflow, setCommentOverflow] = useState(false)

  const classNames = (...classes) => classes.filter(Boolean).join(' ')

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setCommentOverflow(props.content.length > MAX_CHAR_PER_LINE)
  }, [commentOverflow])

  return (
    <div className="comment">
      <div className="flex flex-row ">
        <div>
          <Avatar
            className="mr-4 inline-block"
            size={AVATAR_SIZE}
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-1 gap-4">
            <span className="comment__author">{props.author.name}</span>
            <span className="comment__time">{props.time}</span>
          </div>
          <div className={classNames('flex flex-1 gap-4', expanded ? 'flex-col' : 'flex-row')}>
            <span
              className={classNames(
                'comment__content',
                expanded ? 'expanded' : 'collapse',
                commentOverflow ? 'comment__overflow' : '',
              )}
            >
              {props.content}
            </span>
            <div>
              <Typography.Link className="mr-4 see-more" onClick={toggleExpanded}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {expanded ? 'Show less' : commentOverflow ? 'Show more' : ''}
              </Typography.Link>
              <Popover content={props.lastEdit} trigger="hover">
                <span className="comment__edited" hidden={!props.edited}>
                  Edited
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
  author: PropTypes.object.isRequired,
  time: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  edited: PropTypes.bool.isRequired,
  lastEdit: PropTypes.string.isRequired,
}

export default Comment
