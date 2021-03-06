/* eslint-disable import/extensions */
import { Button, Empty, Radio, Spin, Tooltip } from 'antd'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ganttChartAPI from '../../api/gantt-chart'
import { loadingIcon } from '../../components/loading'
import JfLayout from '../../layouts/layout-task'
import './style.scss'

const GanttChart = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('~/components/gantt-chart/Gantt'),
  // eslint-disable-next-line comma-dangle
  { ssr: false }
)
// const chartMethod = dynamic(import('~/components/gantt-chart/Gantt'), { ssr: false })

function index() {
  const [status, setStatus] = useState('0')
  const [loading, setLoading] = useState(true)
  const [tasks, setTask] = useState({ data: [], links: [] })
  const router = useRouter()
  const [filter, setfilter] = useState('全て')
  // const [chartMethod, setchartMethod] = useState(null)
  const [jobfairStartDate, setJobfairStartDate] = useState(new Date())

  const generateColor = useCallback((taskStatus) => {
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
  }, [])

  const generateTask = (resTask) => {
    const result = { data: [] }
    if (resTask) {
      resTask.forEach((element) => {
        console.log()
        const startTime = new Date(element.start_time.replace(/\//g, '-'))
        const endTime = new Date(moment(element.end_time).endOf('day').format())
        const dataObj = {
          id: element.id,
          text: element.name,
          start_date: startTime,
          end_date: endTime,
          open: true,
          color: generateColor(element.status),
          status: element.status,
          row_height: 40,
          bar_height: 30,
        }
        result.data.push(dataObj)
      })
    }
    return result
  }

  const generateLink = (resTask) => {
    const link = { links: [] }

    resTask.forEach((task) => {
      if (task.before_tasks) {
        task.before_tasks.forEach((element) => {
          const dummyObj = {
            id: uuidv4(),
            source: element.id,
            target: task.id,
            type: '0',
          }
          link.links.push(dummyObj)
        })
      }
      if (task.after_tasks) {
        task.after_tasks.forEach((element) => {
          const dummyObj = {
            id: uuidv4(),
            source: task.id,
            target: element.id,
            type: '1',
          }
          link.links.push(dummyObj)
        })
      }
    })
    console.log(link)
    return link
  }

  const jobfairID = router.query.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        Promise.all([
          ganttChartAPI.getJobfair(jobfairID),

          ganttChartAPI.getTasks(jobfairID),
          ganttChartAPI.getGanttTasks(jobfairID),
        ])
          .then((responses) => {
            const jobfair = responses[0].data
            /* task from old response => don't touch  */
            const oldTaskRes = Array.from(responses[1].data.schedule.tasks)
            // resTask = responses task
            const resTask = responses[2].data
            const links = generateLink(resTask)
            const data = generateTask(oldTaskRes)
            console.log(links)
            setTask({ ...data, ...links })
            setJobfairStartDate(new Date(jobfair.start_date))
            setLoading(false)
            return oldTaskRes
          })
          .catch((error) => {
            setLoading(false)
            if (error.response?.status === 404) {
              router.push('/404')
            }
          })
        return []
      } catch (error) {
        setLoading(false)
        if (error.response.status === 404) {
          router.push('/404')
        }
        return error
      }
    }
    fetchData()
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
    // eslint-disable-next-line import/no-unresolved
    const method = await import('~/components/gantt-chart/Gantt')
    method?.scrollToToday()
    return []
  }
  return (
    <JfLayout id={jobfairID} bgr={3}>
      <JfLayout.Main>
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
                  <Button
                    type="primary"
                    onClick={loading ? '' : scrollToToday}
                    style={{ letterSpacing: '-3px' }}
                  >
                    今日
                  </Button>
                </div>
                <Radio.Group
                  disabled={loading}
                  onChange={onStatusChange}
                  defaultValue={status}
                  buttonStyle="solid"
                  className="flex items-center flex-row"
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

            <div className="gantt-chart">
              <div>
                <div className="container xl ">
                  <div className="h-full">
                    {tasks.data.length ? (
                      <div
                        style={{
                          height: '670px',
                        }}
                      >
                        <p className="hidden">{Boolean(tasks.data.length).toString()}</p>

                        <GanttChart
                          tasks={tasks}
                          jobfairStartDate={jobfairStartDate}
                          filter={filter}
                        />
                      </div>
                    ) : (
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

index.middleware = ['auth:superadmin', 'auth:member']
export default index
