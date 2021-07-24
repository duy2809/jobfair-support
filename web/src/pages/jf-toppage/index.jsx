/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import './style.scss'
import { Input, Space } from 'antd'
import JfLayout from '../../layouts/jf-layout'
import NotificationsJf from '../../components/notifications-jf'
import ChartStatus from '../../components/chart-status'
import ChartMilestone from '../../components/chart-milestone'
import { jfdata } from '../../api/jf-toppage'

export default function jftoppage() {
  const { Search } = Input
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState()
  const [user, setuser] = useState('')
  const [numberOfStudents, setNumberOfStudents] = useState()
  const [numberOfCompanies, setNumberOfCompanies] = useState()
  const [nameTask,setNameTask] = useState('')
  const toHalfWidth = (v) => v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
  const onValueNameChange = (e) => {
    setNameTask(toHalfWidth(e.target.value))
  }
  const fetchTasks = async () => {
    await jfdata().then((response) => {
      setName(response.data.name)
      setStartDate(response.data.start_date.split('-').join('/'))
      setuser(response.data.user.name)
      setNumberOfStudents(response.data.number_of_students)
      setNumberOfCompanies(response.data.number_of_companies)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  const onSearch = (value) => console.log(toHalfWidth(value))
  return (
    <div className="JFTopPage">
      <JfLayout>
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
                      <NotificationsJf />
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="progress">
                    <div className="flex justify-center ...">
                      <div className="search__task">
                        <Space direction="vertical">
                          <Search
                            onChange={onValueNameChange}
                            placeholder="タスク名"
                            onSearch={onSearch}
                            style={{ width: 400 }}
                          />
                        </Space>
                      </div>
                    </div>
                    <div className="flex justify-center ...">
                      <div className="status__global">
                        <h3>ステータス</h3>
                        <div className="status">
                          <ChartStatus />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center ...">
                      <div className="status__global">
                        <h3>マイルストーン</h3>
                        <div className="status">
                          <ChartMilestone />
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
