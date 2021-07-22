import React from 'react'

const Posts = ({ postsToRender }) => (
  <ul>
    {postsToRender.map((post, index) => (
      <li key={index}>
        <strong>{post.id}</strong>
          &nbsp;
        {post.title}
      </li>
    ))}
  </ul>
)
export default Posts
