import React from 'react'
import { Table } from 'antd'
import './style.scss'
import colors from './_colors'

export default function ScheduleTable() {
  const taskWidth = 200
  const milestones = [
    {
      id: 0,
      name: 'Milestone 1',
      numberOfTasks: 4,
      timestamp: '1 week after',
    },
    {
      id: 1,
      name: 'Milestone 2',
      numberOfTasks: 3,
      timestamp: '3 week after',
    },
    {
      id: 2,
      name: 'Milestone 3',
      numberOfTasks: 2,
      timestamp: '5 week after',
    },
    {
      id: 3,
      name: 'Milestone 4',
      numberOfTasks: 2,
      timestamp: '6 week after',
    },
  ]

  const categories = [
    {
      id: 0,
      name: 'Category 1',
      numberOfTasks: 4,
    },
    {
      id: 1,
      name: 'Category 2',
      numberOfTasks: 3,
    },
    {
      id: 3,
      name: 'Category 3',
      numberOfTasks: 2,
    },
    {
      id: 4,
      name: 'Category 4',
      numberOfTasks: 3,
    },
    {
      id: 5,
      name: 'Category 5',
      numberOfTasks: 3,
    },
  ]

  const data = [
    {
      task: {
        id: null,
        name: 'Task name',
        beforeTaskId: null,
        afterTaskId: null,
        categoryId: 0,
        milestoneId: null,
        orderedIndex: null,
      },
    },
    {
      task: {
        id: 1,
        name: 'Task 1',
        beforeTaskId: null,
        afterTaskId: 2,
        categoryId: 0,
        milestoneId: 0,
        orderedIndex: 1,
      },
    },
    {
      task: {
        id: 2,
        name: 'Task 2',
        beforeTaskId: 1,
        afterTaskId: 3,
        categoryId: 0,
        milestoneId: 0,
        orderedIndex: 2,
      },
    },
    {
      task: {
        id: 3,
        name: 'Task 3',
        beforeTaskId: 2,
        afterTaskId: 4,
        categoryId: 0,
        milestoneId: 0,
        orderedIndex: 3,
      },
    },
    {
      task: {
        id: 4,
        name: 'Task 4',
        beforeTaskId: 3,
        afterTaskId: null,
        categoryId: 0,
        milestoneId: 0,
        orderedIndex: 4,
      },
    },
    {
      task: {
        id: 5,
        name: 'Task 1',
        beforeTaskId: null,
        afterTaskId: 2,
        categoryId: 1,
        milestoneId: 1,
        orderedIndex: 1,
      },
    },
    {
      task: {
        id: 6,
        name: 'Task 2',
        beforeTaskId: 1,
        afterTaskId: 3,
        categoryId: 1,
        milestoneId: 1,
        orderedIndex: 2,
      },
    },
    {
      task: {
        id: 7,
        name: 'Task 3',
        beforeTaskId: 2,
        afterTaskId: null,
        categoryId: 1,
        milestoneId: 1,
        orderedIndex: 3,
      },
    },
  ]

  const milestoneColumns = milestones.map((milestone) => ({
    title: `${milestone.timestamp}`,
    dataIndex: 'task',
    align: 'center',
    width: milestone.numberOfTasks * taskWidth,
    render: (task) => {
      if (task.milestoneId !== null) {
        const index = task.orderedIndex
        const total = milestone.numberOfTasks
        const step = (1 / total) * 100
        const percent = (index / total) * 100
        if (task.milestoneId === milestone.id) {
          return {
            props: {
              style: {
                backgroundImage: `-webkit-linear-gradient(
                                left,
                                transparent ${percent - step}%,
                                ${colors[task.categoryId]} ${percent - step}%,
                                ${colors[task.categoryId]} ${percent}%,
                                transparent ${percent}%,
                                transparent 100%
                              )`,
              },
            },
          }
        }
      } else {
        return (
          <>
            <span>{milestone.name}</span>
          </>
        )
      }
      return null
    },
  }))

  const getStartRowIndex = (categoryId) => {
    // row 0: title => no data
    let startIndex = 1
    for (let i = 0; i < categoryId; i += 1) {
      startIndex += categories[i].numberOfTasks
    }
    return startIndex
  }

  const columns = [
    {
      title: '',
      dataIndex: 'task',
      key: 'task',
      width: 200,
      fixed: 'left',
      render: (task, _, rowIndex) => {
        const obj = {
          children: task.categoryId === null ? 'Category name' : categories[task.categoryId].name,
          // props: { style: { color: 'white' } }
          props: {},
        }
        if (rowIndex) {
          const startRowIndex = getStartRowIndex(task.categoryId)
          const rowSpan = categories[task.categoryId].numberOfTasks
          if (rowIndex === startRowIndex) {
            obj.props.rowSpan = rowSpan
            obj.props.className = `bg-category-${task.categoryId}`
          } else if (rowIndex < startRowIndex + rowSpan) {
            obj.props.rowSpan = 0
          }
        }
        return obj
      },
    },
    {
      title: '',
      dataIndex: 'task',
      fixed: 'left',
      width: taskWidth,
      render: (task) => (
        <>
          <span>{task.name}</span>
        </>
      ),
    },
    ...milestoneColumns,
  ]

  return (
    <div className="schedule-gantt">
      <Table
        id="myTable"
        scroll={{ x: 'max-content', y: 'max-content' }}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </div>
    // <OtherLayout>
    //   <OtherLayout.Main>
    //     <div className="flex justify-between mb-10">
    //       <Button type="primary">戻る</Button>
    //     </div>
    //     <h1>JFスケジュール詳細</h1>
    //     <div className="schedule-gantt">
    //       <Table
    //         id="myTable"
    //         scroll={{ x: 'max-content', y: 'max-content' }}
    //         columns={columns}
    //         dataSource={data}
    //         pagination={false}
    //         bordered
    //       />
    //     </div>
    //   </OtherLayout.Main>
    // </OtherLayout>
  )
}
