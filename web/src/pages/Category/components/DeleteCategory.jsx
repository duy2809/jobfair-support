/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Modal, Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

const DeleteCategory = (props) => {
  const onDelete = () => {
    props.onDelete(props.data.id)
  }
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
        onDelete()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <div>
      <Space>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={showDeleteConfirm}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Space>
    </div>
  )
}

export default DeleteCategory
