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
  const [start_date, setstart_date] = useState()
  const [user, setuser] = useState('')
  const [number_of_students, setnumber_of_students] = useState()
  const [number_of_companies, setnumber_of_companies] = useState()
  const fetchTasks = async () => {
    await jfdata().then((response) => {
      setName(response.data.name)
      setstart_date(response.data.start_date)
      setuser(response.data.user.name)
      setnumber_of_students(response.data.number_of_students)
      setnumber_of_companies(response.data.number_of_companies)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  const onSearch = (value) => console.log(value)
  return (
    <div className="JFTopPage">
      <JfLayout>
        <JfLayout.Main>
          <div className="Jf__top">
            <div className="Jf__header">
              <h1>{name}</h1>
              <div className="admin__jf">
                <div className="admin__top">
                  <h3>{start_date}</h3>
                  <h3>{user}</h3>
                </div>
                <div className="admin__top">
                  <h3>
                    {`企業:${number_of_students}`}
                  </h3>
                  <h3>
                    {`学生:${number_of_companies}`}
                  </h3>
                </div>
              </div>
            </div>
            <div className="jf__main">
              <div className="grid grid-cols-11">
                <div className="col-span-7">
                  <div className="notifi">
                    <div className="title">
                      <h3 className='title-h3'>
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
