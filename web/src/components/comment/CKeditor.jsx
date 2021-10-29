import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// import Mention from '@ckeditor/ckeditor5-mention/src/mention'
function CKeditor() {
  ClassicEditor.create('', {})
  //   console.log(window.document.querySelector('#ck-editor'))
  const config = {
    // plugins: [Uploader],
  }
  return (
    <div>
      <div className="App">
        <CKEditor
          editor={ClassicEditor}
          data=""
          config={config}
          onReady={(editor) => {
            console.log(editor)
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            console.log({ data })
          }}
          onBlur={(event, editor) => {}}
          onFocus={(event, editor) => {}}
        />
      </div>
    </div>
  )
}

export default CKeditor
