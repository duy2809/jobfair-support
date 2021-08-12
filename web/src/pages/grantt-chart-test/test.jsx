import React, { Component } from 'react'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

export default class Gantt extends Component {
  componentDidMount() {
    gantt.init(this.ganttContainer)
    gantt.parse(this.props.tasks)
  }

  componentDidUpdate() {
    gantt.render()
  }

  render() {
    return (
      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}
