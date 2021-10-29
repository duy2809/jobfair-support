import { CKEditor } from 'ckeditor4-react'
import React from 'react'

const index = () => {
  return (
    <div>
      <CKEditor
        initData={<p>Hello from CKEditor 4!</p>}
        onInstanceReady={() => {
          alert('Editor is ready!')
        }}
      />
    </div>
  )
}

export default index
