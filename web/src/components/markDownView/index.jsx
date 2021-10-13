import React from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import PropTypes from 'prop-types'

function MarkDownView(props) {
  return (

    <MarkdownPreview source={props.source} />
  )
}
MarkDownView.propTypes = {
  source: PropTypes.string.isRequired,
}
export default MarkDownView
