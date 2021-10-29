import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Avatar, Divider, Modal, notification, Popover, Typography } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { ReactReduxContext, useSelector } from 'react-redux'
import * as deleteCommentAPI from '../../api/comment'
import { commentSelectors } from '../../store/modules/comment'
import actions from '../../store/modules/comment/types'
import MarkDownView from '../markDownView'
import './styles.scss'

function Comment(props) {
  const AVATAR_SIZE = 50
  const MAX_CHAR_PER_LINE = 112
  const [expanded, setExpanded] = useState(false)
  const [commentOverflow, setCommentOverflow] = useState(false)
  const { store } = useContext(ReactReduxContext)
  const [userId, setUserId] = useState(1)

  const classNames = (...classes) => classes.filter(Boolean).join(' ')
  const commentArray = useSelector((state) => commentSelectors.comments(state).toJS())

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setUserId(store.getState().get('auth').get('user').get('id'))
    setCommentOverflow(props.content.length > MAX_CHAR_PER_LINE)
  }, [])

  const editComment = () => {
    console.log(document)
    props.parentCallBack(props)
  }

  const deleteComment = async () => {
    try {
      const comments = commentArray.filter((comment) => comment.id !== props.id)

      const response = await deleteCommentAPI.deleteComment(props.id)

      if (response.status === 200) {
        store.dispatch({
          type: actions.DELETE_COMMENT,
          payload: comments,
        })
        notification.open({
          icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
          duration: 3,
          message: '正常に削除されました',
          onClick: () => {},
        })
      }
      return comments
    } catch (error) {
      return error
    }
  }
  const onDeleteClick = () => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deleteComment()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }

  return (
    <div className="comment">
      <div className="flex flex-row ">
        <div>
          <Avatar
            className="mr-4 inline-block"
            size={AVATAR_SIZE}
            src={`${process.env.APP_URL}/api/avatar/${props.author.id}`}
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between">
            <div className="flex gap-4">
              <span className="comment__author">{props.author.name}</span>
              <span className="comment__time">
                {moment(props.created).format('YYYY/MM/DD HH:mm:ss')}
              </span>
            </div>
            <div className="mr-4" hidden={userId !== props.author.id}>
              <EditTwoTone
                className="border-none mx-1 text-2xl"
                type="primary"
                onClick={editComment}
              />
              <DeleteTwoTone
                className="border-none mx-1 text-2xl"
                type="primary"
                onClick={onDeleteClick}
              />
            </div>
          </div>
          <div className="flex">
            {/* comment content */}
            <div className="">
              {props.content.length > MAX_CHAR_PER_LINE && !expanded ? (
                <MarkDownView
                  id="editor"
                  source={props.content.slice(0, MAX_CHAR_PER_LINE)}
                  className={classNames(
                    'comment__content',
                    expanded ? 'expanded' : 'collapse',
                    commentOverflow ? 'comment__overflow' : ''
                  )}
                />
              ) : (
                <MarkDownView
                  id="editor"
                  source={props.content}
                  className={classNames(
                    'comment__content',
                    expanded ? 'expanded' : 'collapse',
                    commentOverflow ? 'comment__overflow' : ''
                  )}
                />
              )}
            </div>

            {/*   display more button */}
            <Typography.Link className="mr-4 see-more float-right" onClick={toggleExpanded}>
              {/* eslint-disable-next-line no-nested-ternary */}
              {expanded ? '閉じる' : commentOverflow ? 'もっと読む' : ''}
            </Typography.Link>

            <div>
              <Popover
                content={moment(props.lastEdit).format('YYYY/MM/DD HH:mm:ss')}
                trigger="hover"
              >
                <span className="comment__edited text-gray-500 italic" hidden={!props.edited}>
                  編集済み
                </span>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <Divider className="mx-2 bg-gray-300" />
    </div>
  )
}
Comment.propTypes = {
  id: PropTypes.number.isRequired,
  author: PropTypes.object.isRequired,
  created: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  edited: PropTypes.bool.isRequired,
  lastEdit: PropTypes.string.isRequired,
  // assignee: PropTypes.array.isRequired,
  // status: PropTypes.string.isRequired,
  parentCallBack: PropTypes.func.isRequired,
}

export default Comment
