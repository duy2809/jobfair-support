/* eslint-disable no-restricted-globals */
import React from 'react'
import { RollbackOutlined } from '@ant-design/icons'

export default function ErrorNotFound() {
  <div className="flex items-center justify-center mt-24">
    <div className="flex items-center gap-x-8">
      <div
        // className='bg-red-500'
        style={{
          width: '300px',
          height: '300px',
        }}
      >
        <img src="logo.png" alt="logo" width="300" height="300" />
      </div>
      <div
        className="p-14 rounded-3xl"
        style={{
          backgroundColor: '#e3f6f5',
        }}
      >
        <h1>指定されたページは存在しません。</h1>
        <p className="mb-5">
          大変申し訳ございませんが、
          お探しのページは移動もしくは削除された可能性があります。
          アドレスを確認してください。
        </p>
        <div className="flex items-center gap-x-2">
          <RollbackOutlined style={{ fontSize: '18px' }} />
          <button
            className="text-blue-700"
            type="button"
            onClick={() => history.back()}
          >
            前のページへ戻る
          </button>
        </div>
      </div>
    </div>
  </div>
}
