import { FileAddFilled } from '@ant-design/icons'
import { Button, Modal, Form, Input, notification } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { addDocument } from '../../../api/file'

export default function ButtonAddFile(props) {
  const [isDisableFile, setIsDisableFile] = useState(true)
  const [nameFile, setNameFile] = useState('')
  const [link, setLink] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const setNull = () => {
    setNameFile('')
    setLink('')
    form.setFieldsValue({ name_file: '', link: '' })
  }

  const handleCancel = () => {
    setNull()
    setIsModalVisible(false)
  }

  useEffect(() => {
    if (nameFile === '' || link === '') {
      setIsDisableFile(true)
    }
  }, [nameFile, link])

  const openNotificationSuccess = () => {
    setIsModalVisible(false)
    notification.success({
      message: '新しいファイルを追加しました。',
    })
  }

  const onNameFileChange = (e) => {
    setIsDisableFile(false)
    setNameFile(e.target.value)
  }

  const onLinkChange = (e) => {
    setIsDisableFile(false)
    setLink(e.target.value)
  }

  const handleFileOk = async () => {
    let queryPath = ''
    for (let i = 0; i < props.path.length; i += 1) {
      if (i !== 0 && i !== props.path.length - 1) {
        queryPath += `${props.path[i]}/`
      } else if (i === 0) {
        queryPath += '/'
      } else {
        queryPath += props.path[i]
      }
    }

    const res = await addDocument({
      name: nameFile,
      path: queryPath,
      is_file: 1,
      link,
      document_id: props.documentId,
    })
    if (res.data.name) {
      if (res.data.name[0] === 'The name has already been taken.') {
        setIsDisableFile(true)
        form.setFields([
          {
            name: 'name_file',
            errors: ['このファイル名は既に使用されています。'],
          },
        ])
      }
    } else {
      const result = res.data.map((element) => ({
        key: element.id,
        checkbox: ((props.updater.get('id') === element.authorId) || (props.updater.get('role') !== 'member')),
        is_file: element.is_file,
        name: element.name,
        updater: element.updaterName,
        updated_at: element.updated_at,
        link: element.link,
      }))
      if (props.path.length > 1) {
        props.setData([{
          key: -1,
          name: '..',
          checkbox: false,
          is_file: false,
          updater: '',
          updated_at: '',
          link: '',
        }, ...result])
      } else props.setData(result)
      props.setIsCheckAll(false)
      openNotificationSuccess()
      setNull()
    }
    // if (res.data['document.name.unique'] === 'Given name already have in folder') {

    // } else {

    // }
  }

  return (
    <div className="file-add">
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<FileAddFilled />}
        onClick={() => setIsModalVisible(true)}
      >
        新しいファイル
      </Button>
      <Modal
        title="新しいファイル"
        okText="保存"
        cancelText="キャンセル"
        centered
        visible={isModalVisible}
        onOk={handleFileOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: isDisableFile }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          colon={false}
          name="basic"
        >
          <Form.Item
            label={
              <p style={{ margin: 0 }} className="font-bold">名前</p>
            }
            name="name_file"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              }]}
          >
            <Input
              type="text"
              size="large"
              onChange={onNameFileChange}
              placeholder="新しいファイル名"
            />
          </Form.Item>
          <Form.Item
            label={
              <p style={{ margin: 0 }} className="font-bold">リンク</p>
            }
            name="link"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              }]}
          >
            <Input
              type="text"
              size="large"
              onChange={onLinkChange}
              placeholder="グーグルドライブリンク"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

ButtonAddFile.propTypes = {
  updater: PropTypes.isRequired,
  path: PropTypes.string.isRequired,
  documentId: PropTypes.isRequired,
  setData: PropTypes.isRequired,
  setIsCheckAll: PropTypes.isRequired,
}
