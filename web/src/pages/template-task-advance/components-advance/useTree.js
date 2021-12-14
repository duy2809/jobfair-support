import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getNewMilestone } from '../../../api/template-advance'

const useHome = () => {
  const router = useRouter()

  const [SampleData, setSamleData] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [idMilestoneActive, setIdMileStoneActive] = useState(null)

  const fechLeftData = async () => {
    await getNewMilestone()
      .then((res) => {
        setSamleData(res.data)
        setTreeData(res.data[0].task)
        setIdMileStoneActive(res.data[0].id)
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
  }
}
export default useHome
