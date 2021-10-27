import { Tabs } from 'antd'
import React from 'react'
import ListCategory from '../../components/categories/ListCategory'
import MilestoneList from '../../components/milestones'
import OtherLayout from '../../layouts/OtherLayout'
import './style.scss'

const { TabPane } = Tabs
const changeTabs = (key) => {
  console.log(key)
}
function index() {
  return (
    <div className="master-settingPage">
      <OtherLayout>
        <OtherLayout.Main>
          <h1>マスター設定</h1>
          <Tabs defaultActiveKey="1" onChange={changeTabs} size="large">
            <TabPane tab="カテゴリ" key="1">
              <ListCategory />
            </TabPane>
            <TabPane tab="マイルストーン" key="2">
              <MilestoneList />
            </TabPane>
          </Tabs>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

export default index
