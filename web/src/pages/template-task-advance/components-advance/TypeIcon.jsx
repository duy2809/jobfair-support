import React from 'react'
import {
  DeleteTwoTone,
} from '@ant-design/icons'

export const TypeIcon = (props) => {
  // eslint-disable-next-line react/prop-types
  if (props.droppable) {
    return <DeleteTwoTone />
  }

  // eslint-disable-next-line react/prop-types
  switch (props.fileType) {
    case 'image':
      return <DeleteTwoTone />
    case 'csv':
      return <DeleteTwoTone />
    case 'text':
      return <DeleteTwoTone />
    default:
      return null
  }
}
