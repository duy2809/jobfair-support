import React, { useState, useEffect, useRef } from 'react'
import {
  Tree,
  // DragLayerMonitorProps,
  getDescendants,
} from '@minoru/react-dnd-treeview'
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'

import { CustomNode } from './CustomNode'
import { CustomDragPreview } from './CustomDragPreview'
import { AddDialog } from './AddDialog'
import SelectMilestone from './SelectMilestone'
import './App.module.scss'

const ad = [
  {
    id: 1,
    name: 'milestone1',
    task: [
      {
        id: 1,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdaksg',
      },
      {
        id: 2,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 3,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 2,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 3,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 2,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 3,
        parent: 0,
        droppable: true,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 4,
        parent: 1,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 5,
        parent: 1,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
    ],
  },
  {
    id: 2,
    name: 'milestone2',
    task: [
      {
        id: 1,
        parent: 0,
        droppable: true,
        text: 's',
      },
      {
        id: 2,
        parent: 0,
        droppable: true,
        text: 's',
      },
      {
        id: 3,
        parent: 0,
        droppable: true,
        text: 's',
      },
      {
        id: 4,
        parent: 1,
        text: 'sd',
      },
      {
        id: 5,
        parent: 1,
        text: 'ssss',
      },
    ],
  },
]

const getLastId = (treeData) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1
    }
    if (a.id > b.id) {
      return -1
    }

    return 0
  })

  if (reversedArray.length > 0) {
    return reversedArray[0].id
  }

  return 0
}

function App() {
  const SampleData = useRef(ad)
  const [treeData, setTreeData] = useState(SampleData.current[0].task)
  const handleDrop = (newTree) => {
    setTreeData(newTree)
    SampleData.current[0].task = newTree
  }
  const [open, setOpen] = useState(false)
  const [listMilestone, setListmilestone] = useState([])
  const [textAdd, setTextAdd] = useState('')
  console.log(SampleData.current[0].task, 'data')
  const handleTextChange = (id, value) => {
    const newTree = treeData.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          text: value,
        }
      }

      return node
    })

    setTreeData(newTree)
    SampleData.current[0].task = newTree
  }
  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ]
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id))
    setTreeData(newTree)
    SampleData.current[0].task = newTree
  }
  const handleOpenDialog = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleSubmit = (newNode) => {
    const lastId = getLastId(treeData) + 1

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId,
      },
    ])

    setOpen(false)
  }
  const onMilestoneChange = (value) => {
    const newList = SampleData.current.length > 0 ? SampleData.current.filter((item) => item.id === value) : null
    setTreeData(newList[0].task)
  }
  const handleAddText = (e) => {
    e.preventDefault()
    if (
      textAdd.length === 0
    ) return
    const newList = [...treeData]
    newList.push(textAdd)
    setTreeData(newList)
    SampleData.current[0].task = newList
  }
  useEffect(() => {
    const newListMilestone = []
    SampleData.current.forEach((element) => {
      newListMilestone.push({ name: element.name, id: element.id })
    })
    setListmilestone(newListMilestone)
  }, [])
  return (
    <div className="tree">
      <div>
        <div className="header__tree mb-3">
          <div className="tree__left">
            <SelectMilestone
              onMilestoneChange={onMilestoneChange}
              listMilestone={listMilestone}
            />
          </div>
          <div className="tree__right">
            <a onClick={handleOpenDialog}>
              <PlusOutlined style={{ fontSize: '24px', margin: '0 5px' }} />
            </a>
          </div>
        </div>
      </div>
      {open && (
        <AddDialog
          setTreeData={setTreeData}
          tree={treeData}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          SampleData={SampleData}
          handleAddText={handleAddText}
          text={textAdd}
          setText={setTextAdd}
        />
      )}
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, options) => (
          <CustomNode
            node={node}
            {...options}
            onDelete={handleDelete}
            onTextChange={handleTextChange}
          />
        )}
        dragPreviewRender={(monitorProps) => (
          <CustomDragPreview monitorProps={monitorProps} />
        )}
        onDrop={handleDrop}
      />
    </div>
  )
}

export default App
