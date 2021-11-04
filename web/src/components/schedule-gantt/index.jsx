import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Table, Typography } from 'antd'
import { ListScheduleApi } from '~/api/schedule'
import './style.scss'
import colors from './_colors'

const { Paragraph } = Typography

function ScheduleGantt({ id }) {
  const [tasks, setTasks] = useState([])
  const [milestones, setMilestones] = useState([])
  const [categories, setCategories] = useState([])
  const taskWidth = 200
  const taskHeader = {
    task: {
      id: null,
      name: '',
      categoryId: null,
      milestoneId: null,
      orderIndex: null,
    },
  }
  function compareTask(a, b) {
    if (a.categoryId < b.categoryId) {
      return -1
    }
    if (a.categoryId > b.categoryId) {
      return 1
    }
    return 0
  }
  function compareCategories(a, b) {
    if (a.id < b.id) {
      return -1
    }
    if (a.id > b.id) {
      return 1
    }
    return 0
  }
  const formatTask = (taskList) => {
    taskList.sort(compareTask)
    return taskList.map((task) => ({ task }))
  }

  useEffect(async () => {
    try {
      const response = await ListScheduleApi.getGanttChart(id)
      setMilestones(response.data.milestones)
      setCategories(response.data.categories.sort(compareCategories))
      const data = [taskHeader, ...response.data.tasks]
      setTasks(formatTask(data))
    } catch (error) {
      console.log(error)
    }
  }, [])

  const milestoneColumns = milestones.map((milestone) => ({
    title: `${milestone.timestamp}`,
    dataIndex: 'task',
    align: 'center',
    width: milestone.totalIndex * taskWidth,
    render: (task, _, rowIndex) => {
      if (rowIndex === 0) {
        return (
          <>
            <span>{milestone.name}</span>
          </>
        )
      }
      if (task.milestoneId !== null) {
        const index = task.orderIndex + 1
        const total = milestone.totalIndex
        const step = (1 / total) * 100
        const percent = index * step
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
      }
      return null
    },
  }))

  const getStartRowIndex = (categoryId) => {
    if (categoryId != null) {
      // row 0: title => no data
      let startIndex = 1
      for (let i = 0; i < categoryId; i += 1) {
        startIndex += categories[i].numberOfTasks
      }
      return startIndex
    }
    return null
  }

  const columns = [
    {
      title: '',
      dataIndex: 'task',
      key: 'category',
      width: 200,
      fixed: 'left',
      render: (task, _, rowIndex) => {
        const obj = {
          children: '',
          props: {},
        }
        if (task.categoryId == null) {
          obj.children = 'カテゴリ名'
        } else if (rowIndex) {
          obj.children = categories[task.categoryId - 1].name
          const startRowIndex = getStartRowIndex(task.categoryId - 1)
          const rowSpan = categories[task.categoryId - 1].numberOfTasks
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
      render: (task) => {
        if (task.categoryId == null) {
          return <span>タスク名</span>
        }
        return (
          <>
            <a href={`/template-task-dt/${task.id}`}>
              <Paragraph className="break-words" ellipsis={{ rows: 1, tooltip: task.name }}>
                {task.name}
              </Paragraph>
            </a>
          </>
        )
      },
    },
    ...milestoneColumns,
  ]
  return (
    <div className="schedule-gantt mx-auto">
      <Table
        id="myTable"
        scroll={{ x: '100vw', y: '100vh' }}
        columns={columns}
        dataSource={tasks}
        pagination={false}
        bordered
      />
    </div>
  )
}
ScheduleGantt.propTypes = {
  id: PropTypes.string.isRequired,
}
export default ScheduleGantt
