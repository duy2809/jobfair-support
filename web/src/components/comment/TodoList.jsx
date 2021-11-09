import { EditorState, Modifier, convertFromHTML, ContentState } from 'draft-js'
import PropTypes from 'prop-types'
import React from 'react'

function TodoList(props) {
  const addStar = async () => {
    const data = '⭐'
    const { editorState, onChange } = props
    // const contentState = Modifier.replaceText(
    //   editorState.getCurrentContent(),
    //   editorState.getSelection(),
    //   '⭐',
    //   editorState.getCurrentInlineStyle()
    // )
    // onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    const htmlToDraft = await import('html-to-draftjs').then((module) => module.default)
    console.log(htmlToDraft(data))
    let { contentBlocks, entityMap } = htmlToDraft(data)
    let contentStateCus = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      ContentState.createFromBlockArray(contentBlocks, entityMap).getBlockMap()
    )

    onChange(EditorState.push(editorState, contentStateCus, 'insert-fragment'))
  }

  return <div onClick={addStar}>⭐</div>
}
TodoList.propTypes = {
  onChange: PropTypes.func,
  editorState: PropTypes.object,
}

export default TodoList
