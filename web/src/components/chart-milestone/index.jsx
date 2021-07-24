/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import './style.scss'
import MilestoneItem from './milestoneItem'
import { listmilestone } from '../../api/jf-toppage'

export default function ChartMilestone() {
  const [listTask, setlistTask] = useState([])
  const fetchTasks = async () => {
    await listmilestone().then((response) => {
      setlistTask(response.data.data[0].milestones)
      console.log(listTask)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  const listData = listTask.map((item) => (
    <MilestoneItem listTask={item.tasks} milestoneName={item.name} dealine={item.is_week ? `${item.period}Tuần` : `${item.period}ngay`} />
  ))
  // const [listMilestone, setMilestone] = useState([])
  // const [listTask, setlistTask] = useState([])
  // const listStatus = []
  // listTask.forEach((element) => {
  //   listStatus.push(element.status)
  // })
  // const [data, setData] = useState()
  // const status = {
  //   new: listStatus.filter((value) => value === '未着手').length.toString(),
  //   propress: listStatus.filter((value) => value === '進行中').length.toString(),
  //   done: listStatus.filter((value) => value === '完了').length.toString(),
  //   pending: listStatus.filter((value) => value === '中断').length.toString(),
  //   break: listStatus.filter((value) => value === '未完了').length.toString(),
  // }
  // const total = Number(status.new) + Number(status.propress) + Number(status.done) + Number(status.pending) + Number(status.break)
  // const width = {
  //   new: ((Number(status.new) / total) * 100).toString(),
  //   propress: ((Number(status.propress) / total) * 100).toString(),
  //   done: ((Number(status.done) / total) * 100).toString(),
  //   pending: ((Number(status.pending) / total) * 100).toString(),
  //   break: ((Number(status.break) / total) * 100).toString(),
  // }
  // const fetchMilestone = async () => {
  //   await listmilestone().then((response) => {
  //     console.log(response.data)
  //     setMilestone(response.data)
  //     console.log(listMilestone, 'hi')
  // const mile = listMilestone.data
  // console.log(mile, 'mile')
  // const listName = []
  // const listDealine = []
  // const listIs_week = []
  // const listTask = []

  // // eslint-disable-next-line no-unused-expressions
  // mile ? mile[0].milestones.map((element) => {
  //   listName.push(element.name)
  //   listDealine.push(element.period)
  //   listIs_week.push(element.is_week)
  //   listTask.push(element.tasks)
  // }) : null
  // console.log(listName, 'name')
  // console.log(listDealine, 'name')
  // console.log(listIs_week, 'name')
  // console.log(listTask)
  // setlistTask(listTask)
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }
  // useEffect(() => {
  //   try {
  //     fetchMilestone()
  //   } catch (error) {}
  // }, [])
  // // let listData = null
  // // if (listMilestone) {
  // //   listData = listMilestone.map((item, index) => (
  //     <MilestoneItem width={width} milestoneName={item.name} dealine={item.period} />
  //   ))
  // }
  return (
    <div>
      {listData}
    </div>
  )
}
