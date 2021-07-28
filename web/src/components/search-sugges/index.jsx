/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Fragment, useState } from 'react'
import './style.scss'
import PropTypes from 'prop-types'
import { SearchOutlined } from '@ant-design/icons'
import Autosuggest from 'react-autosuggest'
import { notification, Button } from 'antd'
import { useRouter } from 'next/router'

export default function SearchSugges({ listTask }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const router = useRouter()
  const getSuggestionValue = (suggestion) => suggestion.name
  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.name}
    </div>
  )
  const onChange = (event, { newValue }) => {
    setValue(newValue)
  }
  // eslint-disable-next-line no-shadow
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    return inputLength === 0 ? [] : listTask.filter((lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue)
  }
  // eslint-disable-next-line no-shadow
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }
  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }
  const openNotificationWithIcon = (type) => {
    notification[type]({
      closable: false,
      duration: 3,
      description:
            '該当結果が見つかりませんでした',
    })
  }
  function search() {
    let a = true
    listTask.forEach((element) => {
      if (value === element.name) {
        a = false
        router.push(`/task-list?name=${value}`)
      }
    })
    if (a === true) {
      openNotificationWithIcon('error')
    }
  }
  const inputProps = {
    placeholder: 'タスク名',
    value,
    onChange,
  }
  return (
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <Button style={{ border: 'none' }} type="primary" onClick={search} icon={<SearchOutlined />}>検索</Button>
    </>
  )
}
SearchSugges.propTypes = {
  listTask: PropTypes.array.isRequired,
}
