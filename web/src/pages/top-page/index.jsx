/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import { notification } from 'antd'
import List from '../../components/list'
import { tasks, members, jobfairs } from '../../api/top-page'
import { getTaskList as getTemplateTaskList } from '../../api/template-task'
import { ListScheduleApi } from '../../api/schedule'
import Layout from '../../layouts/OtherLayout'
// import TemplateTaskSubTable from '../../components/TemplateTaskSubTable'

const { getListSchedule } = ListScheduleApi

const jfListDataColumn = [
  {
    title: '名前',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'タイム',
    dataIndex: 'time',
    key: 'time',
  },
]

const memListDataColumn = [
  {
    title: '名前',
    dataIndex: 'name',
    key: 'name',
  },
]

const jfScheduleDataColumn = [
  {
    title: '名前',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
]

const templateTaskDataColumn = [
  {
    title: '名前',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'カテゴリ',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'マイルストーン',
    dataIndex: 'milestone',
    key: 'milestone',
  },
]

const taskListDataColumn = [
  {
    title: '名前',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '就職フェアの名前',
    dataIndex: 'jfName',
    key: 'JF Name',
  },
  {
    title: 'タイム',
    dataIndex: 'time',
    key: 'time',
  },
]

const Top = () => {
  const [taskData, setTaskData] = useState([])
  const taskDataItem = []

  const [memberData, setMemberData] = useState([])
  const memberDataItem = []

  const [jobfairData, setJobfairData] = useState([])
  const jobfairDataItem = []

  const [templateData, setTemplateData] = useState([])
  const [scheduleData, setScheduleData] = useState([])

  const [isLoadingTask, setLoadingTask] = useState(false)
  const [isLoadingMember, setLoadingMember] = useState(false)
  const [isLoadingJobfair, setLoadingJobfair] = useState(false)
  const [isLoadingTemplate, setLoadingTemplate] = useState(false)
  const [isLoadingSchedule, setLoadingSchedule] = useState(false)

  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)
  const [id, setId] = useState(0)
  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setId(user.get('id'))
    }
  }, [user])
  useEffect(() => {
    const getTask = async () => {
      setLoadingTask(true)
      const response = await tasks()
      setTaskData(response.data)
      setLoadingTask(false)
    }

    const getMember = async () => {
      setLoadingMember(true)
      const response = await members()
      setMemberData(response.data)
      setLoadingMember(false)
    }

    const getJobfair = async () => {
      setLoadingJobfair(true)
      const response = await jobfairs()
      setJobfairData(response.data)
      setLoadingJobfair(false)
    }

    const getTemplate = async () => {
      setLoadingTemplate(true)
      await getTemplateTaskList().then((res) => {
        const datas = []
        res.data.forEach((data) => {
          // console.log(data);
          const categoriesName = data.categories.map(
            (category) => category.category_name,
          )
          categoriesName.forEach((categoryName) => {
            datas.push({
              name: data.name,
              category: categoryName,
              milestone: data.milestone.name,
            })
          })
        })
        setTemplateData(datas)
        setLoadingTemplate(false)
      })
    }

    const getSchedule = async function () {
      setLoadingSchedule(true)
      let dataItem = []
      await getListSchedule().then((res) => {
        dataItem = res.data.map((data) => ({ name: data.name }))
      })
      setScheduleData(dataItem)
      setLoadingSchedule(false)
    }

    getTask()
    getMember()
    getJobfair()
    getTemplate()
    getSchedule()
  }, [])

  jobfairData.forEach((jobfair) => {
    const jobfairItem = { key: '', name: '', time: '' }
    jobfairItem.key = jobfair.id
    jobfairItem.name = jobfair.name
    jobfairItem.time = jobfair.start_date.replaceAll('-', '/')

    jobfairDataItem.push(jobfairItem)
  })

  memberData.forEach((member) => {
    const memberItem = { key: '', name: '' }
    memberItem.key = member.id
    memberItem.name = member.name

    memberDataItem.push(memberItem)
  })

  taskData.forEach((task) => {
    const taskItem = { key: '', name: '', jfName: '', time: '' }
    taskItem.key = task.id
    taskItem.name = task.name
    taskItem.jfName = task.jobfair.name
    taskItem.time = task.start_time
    taskDataItem.push(taskItem)
  })
  return (
    <Layout>
      <Layout.Main>
        <div>
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                gridGap: '20px',
                width: '100%',
              }}
            >
              <List
                key={1}
                dataColumn={jfListDataColumn}
                dataSource={jobfairDataItem}
                text="JF一覧"
                searchIcon
                showTimeInput
                showCategoryInput={false}
                showMilestoneInput={false}
                route="/jobfairs"
                routeToAdd="/add-jobfair"
                isLoading={isLoadingJobfair}
              />
              <List
                key={2}
                dataColumn={memListDataColumn}
                dataSource={memberDataItem}
                text="メンバ一覧"
                searchIcon
                showTimeInput={false}
                showCategoryInput={false}
                showMilestoneInput={false}
                route="/member"
                routeToAdd="/member/invite"
                isLoading={isLoadingMember}
              />
              <List
                key={3}
                dataColumn={jfScheduleDataColumn}
                dataSource={scheduleData}
                text="JFスケジュール一覧"
                searchIcon
                showTimeInput={false}
                showCategoryInput={false}
                showMilestoneInput={false}
                route="/schedule"
                routeToAdd="/jf-schedule/add"
                isLoading={isLoadingSchedule}
              />
              <List
                key={4}
                dataColumn={templateTaskDataColumn}
                dataSource={templateData}
                text="テンプレートタスク詳細"
                searchIcon
                showTimeInput={false}
                showCategoryInput
                showMilestoneInput
                route="/template-tasks"
                routeToAdd="/add-template-task"
                isLoading={isLoadingTemplate}
              />
              <List
                key={5}
                dataColumn={taskListDataColumn}
                dataSource={taskDataItem}
                text="タスク一覧"
                searchIcon
                showTimeInput
                showCategoryInput={false}
                showMilestoneInput={false}
                showSearchByJFInput
                route={`member/${id}/tasks`}
                isLoading={isLoadingTask}
              />
            </div>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  )
}
Top.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default Top
