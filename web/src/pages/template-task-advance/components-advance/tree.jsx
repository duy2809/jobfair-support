import React, { useState, useEffect, useRef } from 'react'
import {
  Tree,
  // DragLayerMonitorProps,
  getDescendants,
} from '@minoru/react-dnd-treeview'
import {
  PlusOutlined,
} from '@ant-design/icons'
import useTree from './useTree'

import { getNewMilestone } from '../../../api/template-advance'
import { CustomNode } from './CustomNode'
import { CustomDragPreview } from './CustomDragPreview'
import { AddDialog } from './AddDialog'
import SelectMilestone from './SelectMilestone'
import './App.module.scss'

const backupData = [
  {
    id: 1,
    milestone_name: 'milestone1',
    task: [
      {
        id: 1,
        parent: 0,
        text: 'asfsdfasdjglkasdhgjdaksg',
      },
      {
        id: 2,
        parent: 0,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },
      {
        id: 3,
        parent: 0,
        text: 'asfsdfasdjglkasdhgjdakasdsfsg',
      },

    ],
  },
  {
    id: 2,
    milestone_name: 'milestone2',
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
  const { treeData, setTreeData, SampleData, setSamleData, idMilestoneActive, setIdMileStoneActive } = useTree()
  const handleDrop = (newTree) => {
    setTreeData(newTree)
  }
  const [open, setOpen] = useState(false)
  const [textAdd, setTextAdd] = useState('')
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
  }
  const listMilestone = []
  // eslint-disable-next-line no-unused-expressions
  SampleData ? SampleData.forEach((element) => {
    listMilestone.push({ name: element.milestone_name, id: element.id })
  }) : null
  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ]
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id))
    setTreeData(newTree)
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
    const newList = SampleData ? SampleData.filter((item) => item.id === value) : null
    setTreeData(newList ? newList[0].task : null)
    setIdMileStoneActive(value)
  }
  const handleAddText = (text) => {
    if (
      text.length === 0
    ) return
    const dataAdd = {
      id: treeData.length + 1,
      parent: 0,
      text,
      type: 'parent',
    }
    const newList = [...treeData]
    newList.push(dataAdd)
    setTreeData(newList)
    const index = SampleData.findIndex((item) => (item.id === idMilestoneActive))
    const newSample = {
      id: SampleData[index].id,
      milestone_name: SampleData[index].milestone_name,
      task: newList,
    }
    const newSam = SampleData.fill(newSample, index, index + 1)
    setSamleData(newSam)
  }
  // const fechtDataLeft = async () => {
  //   await getNewMilestone()
  //     .then((response) => {
  //       // SampleData.current = response.data
  //       // console.log(response.data, 'res')
  //       // setTreeData(SampleData.current[0].task)
  //       // console.log(treeData, 'samdata')
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 404) {
  //         router.push('/404')
  //       }
  //     })
  // }
  // useEffect(() => {
  //   fechtDataLeft()
  // }, [])
  return (
    <div className="tree">
      <div>
        <div className="header__tree mb-3">
          <div className="tree__left">
            <SelectMilestone
              onMilestoneChange={onMilestoneChange}
              listMilestone={listMilestone}
              treeData={treeData}
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
          handleCloseDialog={handleCloseDialog}
        />
      )}
      <Tree
        tree={treeData || backupData[0].task}
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
