import React, { useState, useEffect } from 'react'
import { Divider, Typography } from 'antd'
import Comment from './Comment'

// comment list sorted by time desc
const data = [
  {
    id: 1,
    author: {
      id: 1,
      name: 'Super Admin',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80',
    },
    time: '10/13 10:14',
    content: 'This is inline comment',
    edited: true,
    lastEdit: '2021/10/13 10:14:15',
  },
  {
    id: 2,
    author: {
      id: 1,
      name: 'Member',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80',
    },
    time: '10/13 10:14',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. At ipsum ullam eos, dolorum ipsa sapiente tenetur sit, architecto consequatur facere quas commodi reiciendis corporis harum totam beatae atque adipisci perspiciatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. At ipsum ullam eos, dolorum ipsa sapiente tenetur sit, architecto consequatur facere quas commodi reiciendis corporis harum totam beatae atque adipisci perspiciatis.',
    edited: true,
    lastEdit: '2021/10/13 10:14:15',
  },
]

function CommentHistory() {
  const [comments, setComments] = useState([])
  const [commentsToShow, setCommentsToShow] = useState([])

  const INIT_COMMENTS_NUM = 5
  const MORE_COMMENTS_NUM = 10
  // TODO: Call API here
  useEffect(() => {
    setComments(data)
    setCommentsToShow(data.slice(0, INIT_COMMENTS_NUM))
  }, [])

  const showMoreComments = () => {
    const next = commentsToShow.length
    const moreComments = comments.slice(next, next + MORE_COMMENTS_NUM)
    setCommentsToShow([...commentsToShow, ...moreComments])
  }
  return (
    <div className="mt-6">
      <span className="comment__count block">コメント(10)</span>
      <Typography.Link className="see-more block text-center" onClick={showMoreComments}>
        もっと見る
      </Typography.Link>
      <Divider className="mx-2 bg-gray-300" />
      {commentsToShow.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.author}
          time={comment.time}
          content={comment.content}
          edited={comment.edited}
          lastEdit={comment.lastEdit}
        />
      ))}
    </div>
  )
}

export default CommentHistory
