import React from 'react'
import { PlusOutlined, CloseCircleOutlined, CheckOutlined, EditTwoTone, FolderFilled,
  ExclamationCircleOutlined,
  FileFilled, SearchOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
export const TypeIcon = (props) => {
  // eslint-disable-next-line react/prop-types
  if (props.droppable) {
    return <DeleteTwoTone />
  }

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
