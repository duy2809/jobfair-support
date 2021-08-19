// export default ScheduleGantt

// import React from 'react'
// import './style.scss'
// export default function Table() {

// const getTasksView = (category) => {
//   return category.tasks.map((task) => <tr>{task}</tr>)
// }
//   return (
//     <table>
//       <thead>
//         <th>No text</th>
//         <th>No text</th>
//         {data.milestones.map((item) => (
//           <th key={item.id} className="header">
//             {item.time}
//           </th>
//         ))}
//       </thead>
//       <tbody>
//         {data.categories.map((item) => (
//           <tr key={item.id}>
//             <td>{item.name}</td>
//             {getTasksView(item)}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }
import React, { useState } from 'react'
import { Table } from 'antd'
import './style.scss'

// const data = {
//   categories: [
//     {
//       id: 1,
//       name: 'category1',
//       tasks: ['task1', 'task2', 'task3']
//     },
//     {
//       id: 2,
//       name: 'category2',
//       tasks: ['task1', 'task2', 'task3']
//     },
//     {
//       id: 3,
//       name: 'category3',
//       tasks: ['task1', 'task2', 'task3']
//     },
//     {
//       id: 4,
//       name: 'category4',
//       tasks: ['task1', 'task2', 'task3']
//     },
//     {
//       id: 5,
//       name: 'category5',
//       tasks: ['task1', 'task2', 'task3']
//     }
//   ],
//   milestones: [
//     {
//       id: 1,
//       time: '1 day after',
//       name: 'milestone 1'
//     },
//     {
//       id: 2,
//       time: '4 days after',
//       name: 'milestone 2'
//     },
//     {
//       id: 3,
//       time: '7 days after',
//       name: 'milestone 3'
//     },
//     {
//       id: 4,
//       time: '10 days after',
//       name: 'milestone 4'
//     },
//     {
//       id: 5,
//       time: '11 days after',
//       name: 'milestone 5'
//     },
//     {
//       id: 6,
//       time: '12 days after',
//       name: 'milestone 6'
//     },
//     {
//       id: 7,
//       time: '13 days after',
//       name: 'milestone 7'
//     },
//     {
//       id: 8,
//       time: '13 days after',
//       name: 'milestone 7'
//     },
//     {
//       id: 9,
//       time: '13 days after',
//       name: 'milestone 7'
//     },
//     {
//       id: 10,
//       time: '13 days after',
//       name: 'milestone 7'
//     },
//     {
//       id: 11,
//       time: '13 days after',
//       name: 'milestone 7'
//     },
//     {
//       id: 12,
//       time: '13 days after',
//       name: 'milestone 7'
//     }
//   ]
// }

export default function ScheduleGantt() {
  const data = [
    {
      category: '',
      tasks: [],
      milestones: [
        '1 week after',
        '2 week after',
        '3 week after',
        '4 week after',
        '5 week after',
        '6 week after',
        '7 week after',
        '8 week after',
        '9 week after',
        '10 week after',
      ],
    },
    {
      category: 'Category name',
      tasks: ['Task name'],
      milestones: ['Milestone 1', '', '', '', '', '', '', '', '', ''],
    },
    {
      category: 'Category 1',
      tasks: ['task1', 'task2'],
      milestones: ['', '', 'Milestone 2', '', '', '', '', '', '', ''],
    },
  // {
  //   category: 'Category name',
  //   tasks: ['Task name'],
  //   milestones: ['Milestone 1', '', '', '', '', '', '', '', '', '']
  // },
  // {
  //   category: 'Category name',
  //   tasks: ['Task name'],
  //   milestones: ['Milestone 1', '', '', '', '', '', '', '', '', '']
  // },
  // {
  //   category: 'Category name',
  //   tasks: ['Task name'],
  //   milestones: ['Milestone 1', '', '', '', '', '', '', '', '', '']
  // },
  // {
  //   category: 'Category name',
  //   tasks: ['Task name'],
  //   milestones: ['Milestone 1', '', '', '', '', '', '', '', '', '']
  // },
  // {
  //   category: 'Category name',
  //   tasks: ['Task name'],
  //   milestones: ['Milestone 1', '', '', '', '', '', '', '', '', '']
  // }
  ]
  const milestoneColumns = data[0].milestones.map((element) => ({
    title: `${element}`,
    dataIndex: 'milestones',
    render: (item) => {
      item.map((e) => <h5>{e}</h5>)
    },
  }))
  const columns = () => [
    {
      title: '',
      dataIndex: 'category',
    },
    {
      title: '',
      dataIndex: 'tasks',
      // render: (tasks) => {
      //   tasks.map((task) => {
      //     return <h5>{task}</h5>;
      //   });
      // }
    },

    ...milestoneColumns,

  ]

  return (
    <Table
      id="myTable"
      // scroll={{ x: 'max-content', y: 'max-content' }}
      scroll={{ x: 1300 }}
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
    />
  )
}
