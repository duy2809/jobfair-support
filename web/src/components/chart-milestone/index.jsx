/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import './style.scss'
import MilestoneItem from './milestoneItem'
import { listmilestone } from '../../api/jf-toppage'

export default function ChartMilestone() {
  const status = { new: '1',
    propress: '3 ',
    done: '10',
    pending: '20',
    break: '10' }
  const [listMilestone, setMilestone] = useState({})
  const total = Number(status.new) + Number(status.propress) + Number(status.done) + Number(status.pending) + Number(status.break)
  const width = {
    new: ((Number(status.new) / total) * 100).toString(),
    propress: ((Number(status.propress) / total) * 100).toString(),
    done: ((Number(status.done) / total) * 100).toString(),
    pending: ((Number(status.pending) / total) * 100).toString(),
    break: ((Number(status.break) / total) * 100).toString(),
  }
  const fetchMilestone = async () => {
    await listmilestone().then((response) => {
      setMilestone(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    fetchMilestone()
  }, [])
  console.log(listMilestone)
  return (
    <div className="Status">
      <MilestoneItem width={width} milestoneName="milestone1" dealine="2022/20/19" />
      <MilestoneItem width={width} milestoneName="milestone2" dealine="2022/20/19" />
    </div>
  )
}
