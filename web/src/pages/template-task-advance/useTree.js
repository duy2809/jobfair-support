// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getNewMilestone } from '../../api/template-advance'

const useHome = (idSchedule) => {
  const router = useRouter()

  const [SampleData, setSamleData] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [idMilestoneActive, setIdMileStoneActive] = useState(null)
  const [dataChartMilestone, setDataChartMilestone] = useState(null)
  const fechLeftData = async () => {
    await getNewMilestone(idSchedule)
      .then((res) => {
        const newSamp = []
        for (let index = 0; index < res.data.length; index += 1) {
          // const element = array[index];
          const newTask = {
            id: res.data[index].id,
            milestone_name: res.data[index].name,
            task: [],
          }
          for (let item = 0; item < res.data[index].template_tasks.length; item += 1) {
            newTask.task.push(
              {
                id: res.data[index].template_tasks[item].id,
                text: res.data[index].template_tasks[item].name,
                parent: 0,
                droppable: false,
              },
            )
            newSamp.push(newTask)
          }
        }
        const newRes = newSamp.filter((item, index) => newSamp.indexOf(item) === index)
        setSamleData(newRes)
        setDataChartMilestone(res.data)
        setTreeData(newRes[0].task)
        setIdMileStoneActive(newRes[0].id)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  useEffect(() => {
    fechLeftData()
  }, [])
  return {
    setSamleData,
    SampleData,
    treeData,
    setTreeData,
    idMilestoneActive,
    setIdMileStoneActive,
    dataChartMilestone,
  }
}
export default useHome
