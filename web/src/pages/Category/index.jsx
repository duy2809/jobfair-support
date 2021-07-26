/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import './style.scss'

import { getCategory, searchCategory } from '../../api/category'

export default function listCategory() {
  const [category, setCategory] = useState([])
  const [data, setData] = useState('')
  useEffect(async () => {
    getCategory().then((res) => {
      setCategory(res)
      // console.log(res)
      // console.log(category)
    }).catch((error) => console.log(error.response.request.response))
  })
  // const onChangeHandler = (text) => {
  //   let matches = []
  //   if(text.length > 0)
  //   {
  //     matches = category.filter(cate => {
  //       const regex = new RegExp(`${text}`, "gi")
  //       return cate.category_name.match(regex)
  //     })
  //   }
  //   console.log('matches',matches)
  //   setSuggestion(matches)
  //   setText(text)
  // }
  async function search(key) {
    console.log(key)
    searchCategory(key).then((result) => {
      setData(result)
      console.log(result)
    })
  }

  return (
    <div>
      <h1>
        カテゴリ一覧
      </h1>
      <br />
      <div className="container">
        <input
          type="text"
          className="col-md-12 input"
          style={{ marginTop: 10 }}
          onChange={(e) => search(e.target.value)}
          placeholder="Search Category name"
        />
      </div>
    </div>
  )
}
