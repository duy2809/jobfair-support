/* eslint-disable import/extensions */
import {
  LoadingOutlined,
} from '@ant-design/icons'
import { Button, Radio, Spin, Tooltip } from 'antd'
import dynamic from 'next/dynamic'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import OtherLayout from '../../layouts/OtherLayout'
import './style.scss'

const DynamicComponentWithNoSSR = dynamic(

  // eslint-disable-next-line import/no-unresolved
  () => import('~/components/gantt-chart/Gantt'),
  { ssr: false },
)

const data = {
  data: [
    { id: 2,
      text: 'タスク',
      start_date: '01-07-2021',
      end_date: '01-09-2021',
      open: true,
      color: '#bebebe',
      row_height: 35,
      bar_height: 30 },
    { id: 1,
      text: 'タスク',
      start_date: '24-08-2021',
      end_date: '01-09-2021',
      open: true,
      row_height: 35,
      bar_height: 30 },
    { id: 4,
      text: 'タスク',
      start_date: '24-08-2021',
      end_date: '01-09-2021',
      open: true,
      row_height: 35,
      bar_height: 30 },
    { id: 3,
      text: 'タスク',
      start_date: '24-08-2021',
      end_date: '01-09-2021',
      open: true,
      row_height: 35,
      bar_height: 30 },
    { id: 5,
      text: 'タスク',
      start_date: '24-08-2021',
      end_date: '01-09-2021',
      open: true,
      row_height: 35,
      bar_height: 30 },
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' },
  ],
}

export default function index() {
  // const [data, setData] = useState({})
  const [status, setStatus] = useState('0')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    console.log(new Date())
    console.log(!<DynamicComponentWithNoSSR />)
    setLoading(false)
  }, [])

  const onStatusChange = (e) => {
    setStatus(e.target.value)
  }
  const scrollToToday = async () => {
  // eslint-disable-next-line import/no-unresolved
    const test = await import('~/components/gantt-chart/Gantt')
    test.scrollToToday()
  }
  const loadingIcon = (
    <LoadingOutlined
      style={{ fontSize: 30,
        color: '#ffd803' }}
      spin
    />
  )
  return (
    <OtherLayout>
      <OtherLayout.Main>
        {/* マイルストーン ガントチャート リストチャート 今日 から まで カテゴリ 全て すべて TC業務  次面接練習 タスクについて  私だけ テンプレート タスクリスト */}
        <div className="gantt-chart-page">

          <div className="container mx-auto flex-1 justify-center px-4">
            {/* page title */}
            <div className="ant-row w-full">
              <Button
                type="primary"
                href="/top-page"
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
                  href="/jobfairs"
                  style={{ letterSpacing: '-2px' }}
                >
                  JF 一 覧
                </Button>

              </div>

            </div>

            <div className="col-span-12 mb-6">
              <div className="flex justify-between px-10">
                <div>
                  <Button
                    type="primary"
                    onClick={scrollToToday}
                    style={{ letterSpacing: '-3px' }}
                  >
                    今日
                  </Button>
                </div>
                <div>
                  <Radio.Group onChange={onStatusChange} defaultValue={status} buttonStyle="solid">
                    <Tooltip placement="topLeft" title="全て"><Radio.Button className="radio-button w-20 p-0 text-center mr-4" style={{ borderRadius: '5px' }} value="0">全て</Radio.Button></Tooltip>
                    <Tooltip placement="topLeft" title="未着手"><Radio.Button className="radio-button w-20 p-0 text-center mr-4" style={{ borderRadius: '5px' }} value="1">未着手</Radio.Button></Tooltip>
                    <Tooltip placement="topLeft" title="進行中"><Radio.Button className="radio-button w-20 p-0 text-center mr-4" style={{ borderRadius: '5px' }} value="2">進行中</Radio.Button></Tooltip>
                    <Tooltip placement="topLeft" title="完了"><Radio.Button className="radio-button w-20 p-0 text-center mr-4" style={{ borderRadius: '5px' }} value="3">完了</Radio.Button></Tooltip>
                    <Tooltip placement="topLeft" title="中断"><Radio.Button className="radio-button w-20 p-0 text-center mr-4" style={{ borderRadius: '5px' }} value="4">中断</Radio.Button></Tooltip>
                    <Tooltip placement="topLeft" title="未完了"><Radio.Button className="radio-button w-20 p-0 text-center mr-4" style={{ borderRadius: '5px' }} value="5">未完了</Radio.Button></Tooltip>
                  </Radio.Group>

                </div>
              </div>

            </div>

            <div className="gantt-chart">
              <div>
                <div className="container xl ">

                  <div>
                    <Spin style={{ fontSize: '30px', color: '#ffd803' }} spinning={loading} indicator={loadingIcon} size="large" />

                    <DynamicComponentWithNoSSR tasks={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OtherLayout.Main>
    </OtherLayout>

  )
}
