import React, { useEffect, useState } from 'react'
import './style.scss'

import { getCategory } from '../../api/category'

export default function listCategory() {
  const [Category,setCategory] = useState([]);
  useEffect(async () =>{
    getCategory().then((res) => {
      setCategory(res)
      console.log(res)
      console.log(Category)
    }).catch((error) => console.log(error.response.request.response))
  })

  return (
    <h1>
      カテゴリ一覧
    </h1>
  )
}
