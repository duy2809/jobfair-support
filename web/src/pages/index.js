import React from 'react'
import Layout from '~/layouts/Default'

import Navbar from '../components/navbar'

export default function Home() {
  return (
    <Layout>
      <Layout.Main>
        <div className="flex justify-center h-screen items-center">
          <p className="text-6xl">Hello World</p>
        </div>
        <Navbar />
      </Layout.Main>
    </Layout>
  )
}




