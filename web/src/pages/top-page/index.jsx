/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import { notification, Row, Col } from 'antd'
import List from '../../components/list'
import ListJfToppage from '../../components/toppage-list-jf'
import { members, jobfairs } from '../../api/top-page'
import { getTaskList as getTemplateTaskList } from '../../api/template-task'
import { ListScheduleApi } from '../../api/schedule'
import Layout from '../../layouts/OtherLayout'
// import TemplateTaskSubTable from '../../components/TemplateTaskSubTable'

const { getListSchedule } = ListScheduleApi

const memListDataColumn = [
  {
    title: '名前',
    dataIndex: 'name',
    key: 'name',
    width: '60%',
  },
  {
    title: 'カテゴリ',
    dataIndex: 'category',
    key: 'category',
    width: '40%',

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
    width: '40%',
  },
  {
    title: 'カテゴリ',
    dataIndex: 'category',
    key: 'category',
    width: '30%',
  },
  {
    title: 'マイルストーン',
    dataIndex: 'milestone',
    key: 'milestone',
    width: '30%',
  },
]

// const taskListDataColumn = [
//   {
//     title: '名前',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: '就職フェアの名前',
//     dataIndex: 'jfName',
//     key: 'JF Name',
//   },
//   {
//     title: 'タイム',
//     dataIndex: 'time',
//     key: 'time',
//   },
// ]

const Top = () => {
  const jfListDataColumn = [
    {
      title: '名前',
      dataIndex: 'name',
      key: 'key',
      width: '60%',
    },
    {
      title: 'タイム',
      dataIndex: 'time',
      key: 'key',
      width: '40%',
    },
  ]

  // const [taskData, setTaskData] = useState([])
  // const taskDataItem = []

  const [memberData, setMemberData] = useState([])

  const [jobfairData, setJobfairData] = useState([])
  const jobfairDataItem = []
  const [role, setRole] = useState()
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
      setRole(user.get('role'))
    }
  }, [user])
  useEffect(() => {
    // const getTask = async () => {
    //   setLoadingTask(true)
    //   const response = await tasks()
    //   setTaskData(response.data)
    //   setLoadingTask(false)
    // }

    const getMember = async () => {
      setLoadingMember(true)
      const response = await members()
      const memberDetailList = response.data.map((member) => ({ key: member.id, name: member.name, category: member.categories.map((category) => category.category_name).join(',') }))
      setLoadingMember(false)
      setMemberData(memberDetailList)
    }
    function sortTime(item1, item2) {
      const dateA = new Date(item1.start_date).getTime()
      const dateB = new Date(item2.start_date).getTime()
      if (dateA > Date.now() && dateB > Date.now()) {
        return dateA < dateB ? 1 : -1
      }
      if (dateA < Date.now() && dateB < Date.now()) {
        return dateA > dateB ? 1 : -1
      }
      return dateA > dateB ? 1 : -1
    }
    const getJobfair = async () => {
      setLoadingJobfair(true)
      const response = await jobfairs()
      const newRes = response.data.sort(sortTime)
      setJobfairData(newRes)
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
              key: data.id,
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
        dataItem = res.data.map((data) => ({ key: data.id, name: data.name }))
      })
      setScheduleData(dataItem)
      setLoadingSchedule(false)
    }

    // getTask()
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
  // memberData.forEach((member) => {
  //   // console.log(member)
  //   const memberItem = { key: '', name: '', category: '' }
  //   memberItem.key = member.id
  //   memberItem.name = member.name
  //   // const memberDetail = getMemberDetail(id).then()
  //   // console.log(member.categories.map((category) => category.category_name).join(','))
  //   // memberItem.category = member.categories.map((category) => category.category_name).join(',')
  //   memberItem.category = 'ytsdfa'
  //   memberDataItem.push(memberItem)
  //   // console.log(memberDataItem)
  // })

  // taskData.forEach((task) => {
  //   const taskItem = { key: '', name: '', jfName: '', time: '' }
  //   taskItem.key = task.id
  //   taskItem.name = task.name
  //   taskItem.jfName = task.jobfair.name
  //   taskItem.time = task.start_time
  //   taskDataItem.push(taskItem)
  // })
  return (
    <Layout>
      <Layout.Main>
        <div>
          <div>
            <div>
              <Row>
                <Col span={12}>
                  <ListJfToppage
                    className="my-3"
                    role={role}
                    key={1}
                    dataColumn={jfListDataColumn}
                    dataSource={jobfairDataItem}
                    text="JF"
                    searchIcon
                    showTimeInput
                    route="/jobfairs"
                    routeToAdd="/add-jobfair"
                    isLoading={isLoadingJobfair}
                  />
                  <List
                    role={role}
                    key={2}
                    id={2}
                    dataColumn={memListDataColumn}
                    dataSource={memberData}
                    text="メンバ"
                    searchIcon
                    showTimeInput={false}
                    showCategoryInput={false}
                    showMilestoneInput={false}
                    route="/member"
                    routeToAdd="/member/invite"
                    isLoading={isLoadingMember}
                  />
                  <List
                    role={role}
                    key={3}
                    id={3}
                    dataColumn={jfScheduleDataColumn}
                    dataSource={scheduleData}
                    text="JFスケジュール"
                    searchIcon
                    showTimeInput={false}
                    showCategoryInput={false}
                    showMilestoneInput={false}
                    route="/schedule"
                    routeToAdd="/jf-schedule/add"
                    isLoading={isLoadingSchedule}
                  />
                  <List
                    role={role}
                    key={4}
                    id={4}
                    dataColumn={templateTaskDataColumn}
                    dataSource={templateData}
                    text="テンプレートタスク"
                    searchIcon
                    showTimeInput={false}
                    showCategoryInput
                    showMilestoneInput
                    route="/template-tasks"
                    routeToAdd="/add-template-task"
                    isLoading={isLoadingTemplate}
                  />

                </Col>
                <Col span={12} />
              </Row>

            </div>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  )
}
Top.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default Top
