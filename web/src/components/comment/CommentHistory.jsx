import React, { useState, useEffect } from 'react'
import { Divider, Typography } from 'antd'
import PropTypes from 'prop-types'
import Comment from './Comment'
import * as commentApi from '../../api/comment'

function CommentHistory({ id }) {
  const [comments, setComments] = useState([])

  const INIT_COMMENTS_NUM = 5
  const MORE_COMMENTS_NUM = 10

  const getMoreComments = async (start, count) => {
    try {
      const response = await commentApi.getComments(id, start, count)
      if (response.status === 200) {
        setComments([...comments, ...response.data])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMoreComments(0, INIT_COMMENTS_NUM)
  }, [])

  return (
    <div className="mt-6">
      <span className="comment__count block">{`コメント(${comments.length})`}</span>
      <Typography.Link
        className="see-more block text-center"
        onClick={() => getMoreComments(comments.length, MORE_COMMENTS_NUM)}
      >
        もっと読む
      </Typography.Link>
      <Divider className="mx-2 bg-gray-300" />
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.author}
          created={comment.created}
          content={comment.content}
          edited={comment.edited}
          lastEdit={comment.lastEdit}
        />
      ))}
    </div>
  )
}

CommentHistory.propTypes = {
  id: PropTypes.number.isRequired,
}

export default CommentHistory
