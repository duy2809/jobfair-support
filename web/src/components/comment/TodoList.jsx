import { Checkbox, Tooltip } from 'antd'
import { EditorState, Modifier } from 'draft-js'
import PropTypes from 'prop-types'
import React from 'react'

function TodoList(props) {
  const addStar = async () => {
    const data = `- [${props.checked ? 'x' : ' '}] ►\n`
    const { editorState, onChange } = props
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      data,
      editorState.getCurrentInlineStyle(),
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    // const htmlToDraft = await import('html-to-draftjs').then((module) => module.default)
    // const { contentBlocks, entityMap } = htmlToDraft(data)
    // const contentStateCus = Modifier.replaceWithFragment(
    //   editorState.getCurrentContent(),
    //   editorState.getSelection(),
    //   ContentState.createFromBlockArray(contentBlocks, entityMap).getBlockMap()
    // )

    // onChange(EditorState.push(editorState, contentStateCus, 'insert-fragment'))
  }
  function onChangeCheck(e) {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <div onClick={addStar}>
      <Tooltip
        placement="topLeft"
        title={props.checked ? 'Create a checkedbox' : 'Create a uncheckedbox'}
      >
        <Checkbox
          checked
          onChange={onChangeCheck}
          className={props.checked ? 'mx-5' : 'disable-checkbox'}
        />
      </Tooltip>
    </div>
  )
}
TodoList.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
}

export default TodoList
