import {
  ContentState,
  convertToRaw,
  DefaultDraftBlockRenderMap,
  EditorState,
  RichUtils,
} from 'draft-js'
import { Map } from 'immutable'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
// import handlePastedText from '../../utils/handleOnPaste'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { MemberApi } from '../../api/member'
import FileAdder from './FileAdder'
import './styles.scss'
import TodoBlock from './TodoBlock'
import TodoList from './TodoList'

const TODO_TYPE = 'todo'

const Editor = dynamic(() => import('react-draft-wysiwyg').then((module) => module.Editor), {
  ssr: false,
  suspense: true,
})
/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
const getDefaultBlockData = (blockType, initialData = {}) => {
  switch (blockType) {
    case TODO_TYPE:
      return { checked: false }
    default:
      return initialData
  }
}
const getBlockRendererFn = (getEditorState, onChange) => (block) => {
  const type = block.getType()
  switch (type) {
    case TODO_TYPE:
      return {
        component: TodoBlock,
        props: {
          onChange,
          getEditorState,
        },
      }
    default:
      return null
  }
}
/*
Changes the block type of the current block.
*/
const resetBlockType = (editorState, newType) => {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  const key = selectionState.getStartKey()
  const blockMap = contentState.getBlockMap()
  const block = blockMap.get(key)
  let newText = ''
  const text = block.getText()
  if (block.getLength() >= 2) {
    newText = text.substr(1)
  }
  const newBlock = block.merge({
    text: newText,
    type: newType,
    data: getDefaultBlockData(newType),
  })
  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0,
    }),
  })
  return EditorState.push(editorState, newContentState, 'change-block-type')
}

function index(props) {
  const commentContent = props.value
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [usersName, setUsersName] = useState([])
  /* onchange */
  const onEditorStateChange = async (state) => {
    setEditorState(state)
    const res = await import('draftjs-to-html')
    const data = res.default(convertToRaw(state.getCurrentContent()))
    props.onChange(data)
  }
  const setEditorStateWhenEditing = async () => {
    const convertMarkdown2Draft = await import('html-to-draftjs').then((module) => module.default)
    const blocksFromHtml = convertMarkdown2Draft(commentContent || '')
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
    const newEditorState = EditorState.createWithContent(contentState)
    setEditorState(newEditorState)
  }
  const getAllUser = async () => {
    const res = await MemberApi.getListMember()
    const names = res.data.map((user) => ({
      text: user.name,
      value: user.name,
      url: `/member/${user.id}`,
    }))
    setUsersName(names)
  }
  useEffect(() => {
    getAllUser()
    setEditorStateWhenEditing()
    return () => setEditorState(EditorState.createEmpty())
  }, [])

  const getEditorState = () => editorState
  const blockRendererFn = getBlockRendererFn(getEditorState, onEditorStateChange)

  const mention = {
    separator: ' ',
    trigger: '@',
    suggestions: usersName,
  }

  const hashtag = {
    separator: ' ',
    trigger: '#',
    suggestions: usersName,
  }
  const blockStyleFn = (block) => {
    switch (block.getType()) {
      case TODO_TYPE:
        return 'block block-todo'
      default:
        return 'block'
    }
  }
  const handleBeforeInput = (str) => {
    if (str !== ']') {
      return false
    }
    /* Get the selection */
    const selection = editorState.getSelection()

    /* Get the current block */
    const currentBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey())
    const blockType = currentBlock.getType()
    const blockLength = currentBlock.getLength()
    if (blockLength === 1 && currentBlock.getText() === '[]]') {
      onEditorStateChange(
        resetBlockType(editorState, blockType !== TODO_TYPE ? TODO_TYPE : 'unstyled'),
      )
      return true
    }
    return false
  }
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onEditorStateChange(newState)
      return true
    }
    return false
  }
  const blockRenderMap = Map({
    [TODO_TYPE]: {
      element: 'div',
    },
  }).merge(DefaultDraftBlockRenderMap)

  return (
    <div className="editor bg-[#F8F9FA]">
      <div className="flex">
        <p className="text-xs italic text-[#888888] mr-5">@ for tag </p>
        <p className="text-xs italic text-[#888888]"># for hashtag</p>
      </div>
      <Editor
        editorState={editorState}
        toolbarClassName=""
        mention={mention}
        // mention={files}
        hashtag={hashtag}
        blockStyleFn={blockStyleFn}
        blockRenderMap={blockRenderMap}
        blockRendererFn={blockRendererFn}
        wrapperClassName="border rounded-md"
        editorClassName="editor__textarean pb-5 px-5 h-full border max-h-96 max-w-94 overflow-hidden"
        handleBeforeInput={handleBeforeInput}
        handleKeyCommand={handleKeyCommand}
        onEditorStateChange={onEditorStateChange}
        handlePastedText={() => false}
        toolbarCustomButtons={[
          <TodoList onChange={onEditorStateChange} editorState={editorState} checked />,
          <TodoList onChange={onEditorStateChange} editorState={editorState} checked={false} />,
          <FileAdder jfID={props.jfID} editorState={editorState} onChange={onEditorStateChange} />,
        ]}
      />
    </div>
  )
}
index.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  jfID: PropTypes.string,
}
export default index
