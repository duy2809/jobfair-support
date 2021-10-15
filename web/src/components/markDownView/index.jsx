import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const MarkdownPreview = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false },
)
function MarkDownView(props) {
  return (
    <MarkdownPreview source={props.source} />
  )
}
MarkDownView.propTypes = {
  source: PropTypes.string.isRequired,
}
export default MarkDownView
