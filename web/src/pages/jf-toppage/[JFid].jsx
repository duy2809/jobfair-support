import React, { useEffect, useState } from 'react'
import './style.scss'
import { useRouter } from 'next/router'

import JfLayout from '../../layouts/jf-layout'
import NotificationsJf from '../../components/notifications-jf'
import ChartStatus from '../../components/chart-status'
import ChartMilestone from '../../components/chart-milestone'
import { jfdata, jftask } from '../../api/jf-toppage'
import SearchSugges from '../../components/search-sugges'

export default function jftoppage() {
  const [listTask, setlistTask] = useState([])
  const [name, setName] = useState('')
  const router = useRouter()
  const idJf = router.query.JFid
  const [startDate, setStartDate] = useState()
  const [user, setuser] = useState('')
  const [numberOfStudents, setNumberOfStudents] = useState()
  const [numberOfCompanies, setNumberOfCompanies] = useState()

  // const fullWidthNumConvert = (fullWidthNum) => fullWidthNum.replace(/[\uFF10-\uFF19]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0xfee0))

  const fetchJF = async () => {
    await jfdata(idJf).then((response) => {
      setName(response.data.name)
      setStartDate(response.data.start_date.split('-').join('/'))
      setuser(response.data.user.name)
      setNumberOfStudents(response.data.number_of_students)
      setNumberOfCompanies(response.data.number_of_companies)
    }).catch((error) => {
      console.log(error)
    })
  }
  const fetchTasks = async () => {
    await jftask(idJf).then((response) => {
      setlistTask(response.data.data[0].tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    fetchJF()
    fetchTasks()
    console.log(listTask, 'listask')
  }, [])

  return (
    <div className="JFTopPage">
      <JfLayout id={idJf}>
        <JfLayout.Main>
          <div className="Jf__top">
            <div className="Jf__header">
              <h1>{name}</h1>
              <div className="admin__jf">
                <div className="admin__top">
                  <h3>{startDate}</h3>
                  <h3>{user}</h3>
                </div>
                <div className="admin__top">
                  <h3>
                    {`企業:${numberOfStudents}`}
                  </h3>
                  <h3>
                    {`学生:${numberOfCompanies}`}
                  </h3>
                </div>
              </div>
            </div>
            <div className="jf__main">
              <div className="grid grid-cols-11">
                <div className="col-span-7">
                  <div className="notifi">
                    <div className="title">
                      <h3 className="title-h3">
                        最近の更新
                      </h3>
                      <NotificationsJf id={idJf} />
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="progress">
                    <div className="flex cha justify-center ...">
                      <div className="search__task">
                        <SearchSugges listTask={listTask} />
                      </div>
                    </div>
                    <div className="flex justify-center ...">
                      <div className="status__global">
                        <h3>ステータス</h3>
                        <div className="status">
                          <ChartStatus task={listTask} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center ...">
                      <div className="status__global">
                        <h3>マイルストーン</h3>
                        <div className="status">
                          <ChartMilestone id={idJf} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
