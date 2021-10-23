import PropTypes from 'prop-types'
import React from 'react'
import Comment from './Comment'

function CommentHistory({ comments }) {
  return (
    <div className="mt-6">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
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
  comments: PropTypes.array.isRequired,
}

export default CommentHistory
