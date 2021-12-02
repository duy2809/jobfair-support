import { FileAddOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Select, Cascader } from 'antd'
import { convertFromRaw, EditorState, Modifier } from 'draft-js'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { getLatest } from '../../api/file'

const { Option } = Select

function FileAdder(props) {
  const [formEditFile] = Form.useForm()
  const [options, setOptions] = useState([])
  const [linkState, setlinkState] = useState([])
  const draftToMarkdown = useCallback(async () => {
    const converter = await import('markdown-draft-js')
    return converter.markdownToDraft
  }, [])
  const [files, setFiles] = useState([])
  const [showModal, setShowModal] = useState(false)
  function onChangeCas(data) {
    const links = []
    const insertion = []
    data.forEach((item) => {
      const opts = options.find((opt) => opt.value === item.toString())
      links.push(opts)
      return opts
    })
    if (links.length > 0) {
      links.forEach((link) => {
        const markdown = `[${link.label}](${link.value})`
        insertion.push(markdown)
      })
      setlinkState(insertion)
    } else {
      setlinkState([])
    }
  }
  const addData = async () => {
    const DraftData = await draftToMarkdown()
    console.log(linkState)
    const markdown = convertFromRaw(DraftData(linkState.join('\n')))
    const { editorState, onChange } = props

    // const contentState = ContentState.createFromText(
    //   `${editorState.getCurrentContent().getPlainText() + linkState.join('\n')}`
    // )
    // const contentState = Modifier.insertText(
    //   editorState.getCurrentContent(),
    //   editorState.getSelection(),
    //   '',
    //   editorState.getCurrentInlineStyle()
    // )
    console.log()
    onChange(EditorState.push(editorState, markdown, 'insert-characters'))
  }
  useEffect(() => {
    addData()
  }, [linkState])
  const showModalFn = () => {
    setShowModal(true)
  }

  // const generateTreeStructure = useCallback((files) => {
  //   const result = []
  //   const level = { result }
  //   files.forEach((file) => {
  //     if (file.path === '/') {
  //       result.push({ id: file.id, label: file.name, value: file.link })
  //     } else {
  //       file.path
  //         .slice(1)
  //         .split('/')
  //         .reduce((r, name, i, a) => {
  //           if (!r[name]) {
  //             r[name] = { result: [] }
  //             r[name].result
  //               ? r.result.push({
  //                   id: file.id,
  //                   label: name || file.name,
  //                   value: file.link,
  //                   children: r[name].result || [],
  //                 })
  //               : r.result.push({
  //                   id: file.id,
  //                   label: name || file.name,
  //                   value: file.link,
  //                 })
  //           }
  //           return r[name]
  //         }, level)
  //     }
  //   })
  //   // console.log(result)
  //   return result
  // }, [])
  /* convert files from response to options */
  // const optionGenerator = (files) => {
  //   const ans = generateTreeStructure(files)
  //   setOptions(ans)
  // }
  const getAllFile = async (id) => {
    try {
      const res = await getLatest(id)
      if (res.data.length > 0) {
        setOptions([])
        setFiles(res.data)
      }
      return res.data
    } catch (err) {
      return []
    }
  }
  useEffect(() => {
    getAllFile(props.jfID)
  }, [props.jfID])
  /* add text to editor */

  const dummyOptions = [
    {
      label: 'Light',
      value: 'light',
      children: new Array(20)
        .fill(null)
        .map((_, index) => ({ label: `Number ${index}`, value: `value ${index}` })),
    },
  ]
  const addNewFile = (e) => {
    console.log(e)
    showModalFn()
  }
  const onEditFileChange = () => {
    const nameFile = formEditFile.getFieldValue('name_file')
    const link = formEditFile.getFieldValue('link')

    if (!nameFile || !link) {
      // setlinkState([...linkState, `[${nameFile}](${link})`])
    }
    // setIsDisableEditFile(false)
  }
  const addLink = (link) => {
    const { editorState, onChange } = props
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      link,
      editorState.getCurrentInlineStyle(),
    )

    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
  }
  const handleEditFileOk = () => {
    const nameInput = formEditFile.getFieldValue('name_file')
    const linkInput = formEditFile.getFieldValue('link')
    console.log(nameInput, linkInput)
    if (nameInput && linkInput) {
      const { editorState, onChange } = props
      const contentState = Modifier.insertText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        `[${nameInput}](${linkInput})\n`,
        editorState.getCurrentInlineStyle(),
      )

      onChange(EditorState.push(editorState, contentState, 'insert-characters'))
      formEditFile.resetFields()
      setShowModal(false)
    }
  }
  const onFileSelect = (e, selected) => {
    const link = `[${selected.children}](${selected.value})\n`
    addLink(link)
  }
  return (
    <div className="m-2 flex items-center">
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a file"
        optionFilterProp="children"
        value="Select a file"
        onChange={onFileSelect}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {files.map((file) => (
          <Option key={file.id} value={file.link}>
            {file.name}
          </Option>
        ))}
      </Select>
      <Cascader
        style={{ width: 233 }}
        options={options || dummyOptions}
        onChange={onChangeCas}
        multiple
        className="hidden"
        placeholder="Select a file"
        maxTagCount="responsive"
      />
      <Modal
        title="ファイル編集"
        okText="保存"
        cancelText="キャンセル"
        centered
        visible={showModal}
        onOk={handleEditFileOk}
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <Form
          form={formEditFile}
          onValuesChange={onEditFileChange}
          layout="horizontal"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          name="basic"
          size="large"
        >
          <Form.Item
            label={<span className="font-bold mr-3">名前</span>}
            name="name_file"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
            ]}
          >
            <Input type="text" size="large" placeholder="新しいファイル名" />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold mr-3">リンク</span>}
            name="link"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
            ]}
          >
            <Input type="text" size="large" placeholder="グーグルドライブリンク" />
          </Form.Item>
        </Form>
      </Modal>
      <div onClick={addNewFile} className="cursor-pointer">
        <FileAddOutlined className="text-xl  mx-2 " />
      </div>
    </div>
  )
}
FileAdder.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  jfID: PropTypes.string.isRequired,
}

export default FileAdder
