/* eslint-disable import/extensions */
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Radio, Spin, Tooltip, Empty } from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ganttChartAPI from '../../api/gantt-chart'
import JfLayout from '../../layouts/JFLayout'
import './style.scss'

const GanttChart = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('~/components/gantt-chart/Gantt'),
  // eslint-disable-next-line comma-dangle
  { ssr: false }
)

export default function index() {
  // const [data, setData] = useState({})
  const [status, setStatus] = useState('0')
  const [loading, setLoading] = useState(true)
  const [tasks, setTask] = useState({})
  const router = useRouter()
  const [milestones, setMilestones] = useState([])
  const [filter, setfilter] = useState('全て')
  const [chartMethod, setchartMethod] = useState()
  const [jobfairStartDate, setJobfairStartDate] = useState(Date)

  const generateColor = (taskStatus) => {
    switch (taskStatus) {
      case '未着手':
        return '#5eb5a6'

      case '進行中':
        return '#a1af2f'

      case '完了':
        return '#4488c5'

      case '中断':
        return '#b95656'

      case '未完了':
        return ' #795617'

      default:
        return 'blue'
    }
  }
  const generateTask = (data) => {
    const result = { data: [] }
    data.forEach((element) => {
      const dataObj = {
        id: element.id,
        text: element.name,
        start_date: new Date(element.start_time.replace(/\//g, '-')),
        // start_date: new Date(),
        end_date: new Date(element.end_time.replace(/\//g, '-')),
        open: true,
        color: generateColor(element.status),
        status: element.status,
        row_height: 40,
        bar_height: 30,
      }
      result.data.push(dataObj)
    })
    return result
  }

  const generateLink = (beforeTasks, afterTasks) => {
    const link = { links: [] }
    beforeTasks.before_tasks.forEach((element) => {
      const dummyObj = {
        id: uuidv4(),
        source: element.id,
        target: beforeTasks.id,
        type: '0',
      }
      link.links.push(dummyObj)
    })
    afterTasks.after_tasks.forEach((element) => {
      const dummyObj = {
        id: uuidv4(),
        source: afterTasks.id,
        target: element.id,
        type: '0',
      }
      link.links.push(dummyObj)
    })
    return link
  }
  const jobfairID = router.query.id
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // eslint-disable-next-line import/no-unresolved
        const method = await import('~/components/gantt-chart/Gantt')
        // TODO: optimize this one by using axios.{all,spread}
        const jobfair = await ganttChartAPI.getJobfair(jobfairID)
        const jobfairTask = await ganttChartAPI.getTasks(jobfairID)
        const jobfairMilestone = await ganttChartAPI.getMilestones(jobfairID)
        const data = generateTask(jobfairTask.data.schedule.tasks)
        const beforeTasks = await ganttChartAPI.getBeforeTasks(jobfairID)
        const afterTasks = await ganttChartAPI.getAfterTasks(jobfairID)
        const link = generateLink(beforeTasks.data, afterTasks.data)
        console.log(beforeTasks.data, afterTasks.data)
        setJobfairStartDate(new Date(jobfair.data.start_date))
        setLoading(false)
        setMilestones(jobfairMilestone.data.schedule.milestones)
        setTask({ ...data, ...link })
        setchartMethod(method)
        return null
      } catch (error) {
        return Error('内容が登録されません。よろしいですか？')
      }
    }
    fetchAPI()
  }, [])

  const onStatusChange = (e) => {
    const cases = e.target.value * 1
    switch (cases) {
      case 0:
        setfilter('全て')
        break
      case 1:
        setfilter('未着手')
        break
      case 2:
        setfilter('進行中')
        break
      case 3:
        setfilter('完了')
        break
      case 4:
        setfilter('中断')
        break
      case 5:
        setfilter('未完了')
        break

      default:
        setfilter('Hello')
        break
    }

    setStatus(e.target.value)
  }
  const scrollToToday = async () => {
    chartMethod.scrollToToday()
  }
  const loadingIcon = <LoadingOutlined style={{ fontSize: 30, color: '#ffd803' }} spin />
  return (
    <JfLayout id={jobfairID}>
      <JfLayout.Main>
        {/* マイルストーン ガントチャート リストチャート 今日 から まで カテゴリ 全て すべて TC業務  次面接練習 タスクについて  私だけ テンプレート タスクリスト */}
        <div className="gantt-chart-page min-h-screen">
          <div className="container mx-auto flex-1 justify-center px-4">
            {/* page title */}
            <div className="ant-row w-full">
              <Button
                type="primary"
                onClick={() => {
                  router.push('/top-page')
                }}
                className="mb-6"
                style={{ letterSpacing: '-2px' }}
              >
                戻る
              </Button>
              <div className="w-full flex  justify-between mb-10">
                <h1 className="text-3xl m-0 p-0">ガントチャート</h1>
                <Button
                  type="primary"
                  className="tracking-tighter"
                  onClick={() => {
                    router.push('/jobfairs')
                  }}
                >
                  JF一覧
                </Button>
              </div>
            </div>

            <div className="col-span-12 mb-6">
              <div className="flex justify-between px-10">
                <div>
                  <Button type="primary" onClick={scrollToToday} style={{ letterSpacing: '-3px' }}>
                    今日
                  </Button>
                </div>
                <div>
                  <Radio.Group
                    disabled={loading}
                    onChange={onStatusChange}
                    defaultValue={status}
                    buttonStyle="solid"
                  >
                    <Tooltip placement="topLeft" title="全て">
                      <Radio.Button
                        className=" radio-button w-20 p-0 text-center mr-4"
                        style={{ borderRadius: '5px' }}
                        value="0"
                      >
                        全て
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="未着手">
                      <Radio.Button
                        className="radio-button w-20 p-0 text-center mr-4"
                        style={{ borderRadius: '5px' }}
                        value="1"
                      >
                        未着手
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="進行中">
                      <Radio.Button
                        className="radio-button w-20 p-0 text-center mr-4"
                        style={{ borderRadius: '5px' }}
                        value="2"
                      >
                        進行中
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="完了">
                      <Radio.Button
                        className="radio-button w-20 p-0 text-center mr-4"
                        style={{ borderRadius: '5px' }}
                        value="3"
                      >
                        完了
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="中断">
                      <Radio.Button
                        className="radio-button w-20 p-0 text-center mr-4"
                        style={{ borderRadius: '5px' }}
                        value="4"
                      >
                        中断
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="未完了">
                      <Radio.Button
                        className="radio-button w-20 p-0 text-center mr-4"
                        style={{ borderRadius: '5px' }}
                        value="5"
                      >
                        未完了
                      </Radio.Button>
                    </Tooltip>
                  </Radio.Group>
                </div>
              </div>
            </div>

            <div className="gantt-chart">
              <div>
                <div className="container xl ">
                  <div className="h-full">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Empty
                          className="relative border w-full h-3/4 py-10 mx-10 border-solid rounded-sm "
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                          <Spin
                            style={{ color: '#ffd803' }}
                            spinning={loading}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            indicator={loadingIcon}
                            size="large"
                          />
                        </Empty>
                      </div>
                    ) : (
                      <GanttChart
                        tasks={tasks}
                        jobfairStartDate={jobfairStartDate}
                        milestones={milestones}
                        filter={filter}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </JfLayout.Main>
    </JfLayout>
  )
}
