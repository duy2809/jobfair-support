import React from 'react'
import PropTypes from 'prop-types'

const Posts = ({ postsToRender }) => (
  <ul>
    {postsToRender.map((post, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={index}>
        <span>{post.name}</span>
        <span>{post.created_at}</span>
        <span>{post.username}</span>
      </li>
    ))}
  </ul>
)
export default Posts

Posts.propTypes = {
  postsToRender: PropTypes.array.isRequired,
}
