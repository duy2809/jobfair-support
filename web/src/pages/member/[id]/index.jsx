import React, { useState, useContext, useEffect } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Button } from 'antd'
import Link from 'next/link'
import MemberDetailTable from '../../../components/member-detail-table'
import TaskControl from '../../../components/member-detail-task-control'
import Layout from '../../../layouts/OtherLayout'

function MemberDetailPage() {
  const [id, setID] = useState(0)
  const [role, setRole] = useState(3)
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setRole(user.get('role'))
    }
  }, [user])
  function setIdFromtable(idTable) {
    setID(idTable)
  }
  return (
    <Layout>
      <Layout.Main>
        <Link href="/member/">
          <Button type="primary" className="mb-5">
            戻る
          </Button>
        </Link>
        <h1>メンバ詳細</h1>
        <div className="flex flex-col">
          <TaskControl id={id} role={role} />
          <MemberDetailTable setID={setIdFromtable} />
        </div>
      </Layout.Main>
    </Layout>
  )
}

MemberDetailPage.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default MemberDetailPage
