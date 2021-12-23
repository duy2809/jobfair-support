/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import {
  Tree,
  // DragLayerMonitorProps,
  getDescendants,
} from '@minoru/react-dnd-treeview'
import { PlusOutlined } from '@ant-design/icons'
import useTree from '../../pages/template-task-advance/useTree'

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
        text: 'test',
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
        text: 'test',
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

// eslint-disable-next-line react/prop-types
function App({
  idSchedule,
  onAfterChange,
  SampleData,
  setSamleData,
  idMilestoneActive,
  setIdMileStoneActive,
  dayMilestone,
  dataChartMilestone,
}) {
  const defaultTime = []
  if (dataChartMilestone) {
    for (let index = 0; index < dataChartMilestone.length; index += 1) {
      if (dataChartMilestone[index].milestone_id === idMilestoneActive) {
        defaultTime.push(dataChartMilestone[index])
      }
    }
  }

  const daysStart = dayMilestone
  const [daysMilestone, setDaysMilestone] = useState(daysStart)
  const { treeData, setTreeData } = useTree(idSchedule)
  const handleDrop = (newTree) => {
    for (let index = 0; index < newTree.length; index += 1) {
      if (newTree[index].droppable) {
        newTree[index].parent = 0
      }
    }
    setTreeData(newTree)
    const index = SampleData.findIndex((item) => item.id === idMilestoneActive)
    const newSample = {
      id: SampleData[index].id,
      milestone_name: SampleData[index].milestone_name,
      task: newTree,
    }
    const newSam = SampleData.fill(newSample, index, index + 1)
    setSamleData(newSam)
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
    const index = SampleData.findIndex((item) => item.id === idMilestoneActive)
    const newSample = {
      id: SampleData[index].id,
      milestone_name: SampleData[index].milestone_name,
      task: newTree,
    }
    const newSam = SampleData.fill(newSample, index, index + 1)
    setSamleData(newSam)
  }
  const listMilestone = []
  // eslint-disable-next-line no-unused-expressions
  SampleData
    ? SampleData.forEach((element) => {
      listMilestone.push({ name: element.milestone_name, id: element.id })
    })
    : null
  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ]
    // eslint-disable-next-line prefer-const
    let listChil = treeData.filter((node) => node.parent === id)
    // eslint-disable-next-line prefer-const
    listChil[0].parent = 0
    for (let index = 0; index < listChil.length; index += 1) {
      listChil[index].parent = 0
    }
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id))
    const newChil = newTree.concat(listChil)
    setTreeData(newChil)
    const index = SampleData.findIndex((item) => item.id === idMilestoneActive)
    const newSample = {
      id: SampleData[index].id,
      milestone_name: SampleData[index].milestone_name,
      task: newChil,
    }
    const newSam = SampleData.fill(newSample, index, index + 1)
    setSamleData(newSam)
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
    const newList = SampleData
      ? SampleData.filter((item) => item.id === value)
      : null
    setTreeData(newList ? newList[0].task : null)
    setIdMileStoneActive(value)
    const daysActive = dayMilestone.filter((item) => item.id === value)
    setDaysMilestone(daysActive)
  }
  const handleAddText = (text) => {
    if (text.length === 0) return
    const dataAdd = {
      id: Math.floor(Math.random() * (9999 - 1000)) + 1000,
      parent: 0,
      droppable: true,
      text,
    }
    const newList = [...treeData]
    newList.push(dataAdd)
    setTreeData(newList)
    const index = SampleData.findIndex((item) => item.id === idMilestoneActive)
    const newSample = {
      id: SampleData[index].id,
      milestone_name: SampleData[index].milestone_name,
      task: newList,
    }
    const newSam = SampleData.fill(newSample, index, index + 1)
    setSamleData(newSam)
  }
  return (
    <div className="tree">
      <div>
        <div className="header__tree mb-3">
          <div className="tree__left">
            <SelectMilestone
              onMilestoneChange={onMilestoneChange}
              listMilestone={listMilestone}
              treeData={treeData}
              idSchedule={idSchedule}
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
        className="my-3"
        render={(node, options) => (
          <CustomNode
            node={node}
            {...options}
            onDelete={handleDelete}
            onTextChange={handleTextChange}
            onAfterChange={onAfterChange}
            treeData={treeData}
            daysMilestone={daysMilestone}
            defaultTime={defaultTime}
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
