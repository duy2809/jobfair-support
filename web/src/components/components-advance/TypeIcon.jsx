import React from 'react'
import { FolderFilled,
  FileFilled } from '@ant-design/icons'

export const TypeIcon = (props) => {
  // eslint-disable-next-line react/prop-types
  switch (props.fileType) {
    case 'chil':
      return <FileFilled />
    case 'father':
      return <FolderFilled />
    default:
      return null
  }
}
