import { EditorState, Modifier } from 'draft-js'
import { getSelectedBlock } from 'draftjs-utils'
import htmlToDraft from 'html-to-draftjs'
import { List } from 'immutable'

const handlePastedText = (text, html, editorState, onChange) => {
  const selectedBlock = getSelectedBlock(editorState)
  if (selectedBlock && selectedBlock.type === 'code') {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
      editorState.getCurrentInlineStyle(),
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    return true
  }
  if (html) {
    const contentBlock = htmlToDraft(html)
    let contentState = editorState.getCurrentContent()
    contentBlock.entityMap.forEach((value, key) => {
      contentState = contentState.mergeEntityData(key, value)
    })
    contentState = Modifier.replaceWithFragment(
      contentState,
      editorState.getSelection(),
      new List(contentBlock.contentBlocks),
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    return true
  }
  return false
}

export default handlePastedText
