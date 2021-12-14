/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
// import IconButton from '@material-ui/core/IconButton'
// import { ArrowRight, Delete, FileCopy } from '@material-ui/icons'
import { PlusOutlined, CloseCircleOutlined, CheckOutlined, EditTwoTone, FolderFilled,
  ExclamationCircleOutlined,
  FileFilled, SearchOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'
import { useDragOver } from '@minoru/react-dnd-treeview'
import {
  DeleteTwoTone,
// eslint-disable-next-line import/no-duplicates
} from '@ant-design/icons'
import { TypeIcon } from './TypeIcon'
import styles from './CustomNode.module.scss'

export const CustomNode = (props) => {
  const [hover, setHover] = useState(false)
  const { id, parent, text } = props.node
  const indent = props.depth * 24
  const [labelText, setLabelText] = useState(text)
  const [iseOpen, setIsOpen] = useState(false)
  const [visibleInput, setVisibleInput] = useState(false)
  const handleToggle = (e) => {
    setIsOpen(!iseOpen)
    e.stopPropagation()
    props.onToggle(props.node.id)
  }
  const handleShowInput = () => {
    setVisibleInput(true)
  }
  const handleCancel = () => {
    setLabelText(text)
    setVisibleInput(false)
  }

  const handleChangeText = (e) => {
    setLabelText(e.target.value)
  }

  const handleSubmit = () => {
    setVisibleInput(false)
    props.onTextChange(id, labelText)
  }
  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle)
  return (
    <div
      className={`tree-node mb-1 ${styles.root}`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="item">
        {visibleInput
          ? (
            <div className={styles.inputWrapper}>
              <input
                className="input_edit"
                value={labelText}
                onChange={handleChangeText}
              />
              <a
                className={styles.editButton}
                onClick={handleSubmit}
                disabled={labelText === ''}
              >
                <CheckOutlined className="mx-1" />
              </a>
              <a className={styles.editButton} onClick={handleCancel}>
                <CloseCircleOutlined className={styles.editIcon} />
              </a>

            </div>
          )
          : (
            <>
              <Row gutter={[50, 50]}>
                <Col span={15}>
                  <div className="flex items-center">
                    <div
                      className={`mr-2 ${styles.expandIconWrapper} ${
                        props.isOpen ? styles.isOpen : ''
                      }`}
                    >
                      {!props.node.parent && (
                        <div onClick={handleToggle}>
                          {
                            iseOpen ? <DownOutlined /> : <RightOutlined />
                          }
                        </div>
                      )}

                    </div>
                    <div className="flex items-center">
                      <div className="mr-1">
                        {props.node.parent === 0
                          ? <FolderFilled />
                          : <FileFilled />}
                      </div>
                      <span variant="body2">{props.node.text}</span>
                    </div>
                  </div>

                </Col>
                <Col span={9}>
                  <div className={styles.actionButton}>
                    <a className="mr-1" onClick={handleShowInput}>
                      <EditTwoTone className="" />
                    </a>
                    <a size="small ml-10" onClick={() => props.onDelete(id)}>
                      <DeleteTwoTone />
                    </a>
                  </div>
                </Col>

              </Row>
            </>
          )}
      </div>

    </div>
  )
}
