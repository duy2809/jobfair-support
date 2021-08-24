import React from 'react'
import dynamic from 'next/dynamic'
import { Button } from 'antd'
import OtherLayout from '../../layouts/OtherLayout'

const DynamicComponentWithNoSSR = dynamic(

  // eslint-disable-next-line import/no-unresolved
  () => import('~/components/gantt-chart/Gantt'),
  { ssr: false },
)
const data = {
  data: [
    { id: 2, text: 'Task #2', start_date: '10-08-2021', end_date: '01-09-2021' },
    { id: 1, text: 'Task #1', start_date: '24-08-2021', end_date: '01-09-2021' },
    { id: 4, text: 'Task #2', start_date: '24-08-2021', end_date: '01-09-2021' },
    { id: 3, text: 'Task #2', start_date: '24-08-2021', end_date: '01-09-2021' },
    { id: 5, text: 'Task #2', start_date: '24-08-2021', end_date: '01-09-2021' },
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' },
  ],
}

export default function index() {
  return (
    <OtherLayout>
      <OtherLayout.Main>
        {/* マイルストーン ガントチャート リストチャート 今日 から まで カテゴリ すべて TC業務  次面接練習 タスクについて  私だけ テンプレート タスクリスト */}
        <div className="flex justify-between mb-10">
          <Button type="primary">戻る</Button>
          <Button type="primary" className="tracking-tighter" style={{ letterSpacing: '-2px' }}>タスクリスト</Button>
        </div>
        <div className="container mx-auto flex-1 justify-center px-4  pb-20">
          {/* page title */}
          <h1 className="text-3xl">タスク ガントチャート</h1>
          <div className="gantt-chart">
            <div>
              <div className="container xl ">

                <div>
                  <DynamicComponentWithNoSSR tasks={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </OtherLayout.Main>
    </OtherLayout>

  )
}
