/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import { Modal, Space } from 'antd'
import { ExclamationCircleOutlined, DeleteTwoTone } from '@ant-design/icons'

import { deleteCategory } from '../../../api/category'

const { confirm } = Modal

const DeleteCategory = (props) => {
  const onDelete = () => props.record.id
  function showDeleteConfirm() {
    confirm({
      title: '削除カテゴリ',
      icon: <ExclamationCircleOutlined />,
      content: 'このカテゴリを削除してもよろしいですか？',
      okText: '保存',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk() {
        console.log('OK')
        deleteCategory(onDelete())
        window.location.reload()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <div>
      <Space>
        <DeleteTwoTone onClick={showDeleteConfirm} />
      </Space>
    </div>
  )
}

export default DeleteCategory
