import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import dynamic from 'next/dynamic'
import React, { useEffect, useState, memo } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { MemberApi } from '../../api/member'
import './styles.scss'
const Editor = dynamic(() => import('react-draft-wysiwyg').then((module) => module.Editor), {
  ssr: false,
  suspense: true,
})

function Tiptap(props, { users }) {
  const [commentContent, setCommentContent] = useState(props.value)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [usersName, setUsersName] = useState([])
  const onEditorStateChange = async (state) => {
    setEditorState(state)
    const res = await import('draftjs-to-markdown')
    const data = res.default(convertToRaw(state.getCurrentContent()))
    props.onChange(data)
  }
  const setEditorStateWhenEditing = async () => {
    const convertMarkdown2Draft = await import('markdown-draft-js').then(
      (module) => module.markdownToDraft
    )
    setEditorState(
      EditorState.createWithContent(convertFromRaw(convertMarkdown2Draft(commentContent)))
    )
  }
  const getAllUser = async () => {
    const res = await MemberApi.getListMember()
    const names = res.data.map((user) => {
      return { text: user.name, value: user.name, url: `/member/${user.id}` }
    })
    setUsersName(names)
  }
  useEffect(() => {
    getAllUser()
    setEditorStateWhenEditing()
    return () => setEditorState(EditorState.createEmpty())
  }, [])

  const mention = {
    separator: ' ',
    trigger: '@',
    suggestions: usersName,
  }
  const hashtag = {
    separator: ' ',
    trigger: '#',
  }
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
        hashtag={hashtag}
        wrapperClassName="border rounded-md"
        editorClassName="editor__textarean pb-5 px-5 h-full border max-h-96 max-w-94 overflow-hidden"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  )
}
Tiptap.getInitialProps = async (ctx) => {
  const res = await MemberApi.getListMember()
  console.log(res)
  return { users: res.data }
}

export default memo(Tiptap)
