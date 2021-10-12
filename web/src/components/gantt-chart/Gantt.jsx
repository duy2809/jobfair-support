import React, { Component } from 'react'

import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import './Gantt.css'
import './material.css'
import './style.scss'
import PropTypes from 'prop-types'

export default class Gantt extends Component {
  constructor(props) {
    super(props)
    this.state = { filter: this.props.filter }
  }

  componentDidMount() {
    const { tasks } = this.props
    // const { tasks } = this.props
    console.log(tasks)
    const jobfairStartDate = this.props.jobfairStartDate
    console.log(jobfairStartDate)
    /* Full List of Extensions */
    gantt.plugins({
      click_drag: true,
      drag_timeline: true,
      tooltip: true,
      overlay: true,
      auto_scheduling: true,
      fullscreen: true,
      keyboard_navigation: true,
      multiselect: true,
      // quick_info: true,
      undo: true,
      marker: true,
    })

    /* date height */
    gantt.config.min_column_width = 44
    gantt.config.scale_height = 120
    gantt.config.drag_progress = true
    // gantt.config.show_markers = true
    gantt.config.work_time = true

    /* config layout */
    gantt.config.layout = {
      css: 'material',
      rows: [
        {
          cols: [
            { view: 'grid', scrollX: 'scrollHor', scrollY: 'scrollVer' },

            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },

            { view: 'scrollbar', id: 'scrollVer' },
          ],
        },
        { view: 'scrollbar', scroll: 'x', id: 'scrollHor' },
      ],
    }
    gantt.templates.scale_cell_class = (date) => {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return 'weekend'
      }
      return ''
    }
    gantt.config.lightbox.sections = []
    gantt.attachEvent('onBeforeLightbox', () => false)

    // custom link style
    gantt.templates.link_class = (link) => {
      const types = gantt.config.links
      switch (link.type) {
        case types.finish_to_start:
          return 'finish_to_start'
        case types.start_to_finish:
          return 'start_to_finish'
        case types.start_to_start:
          return 'start_to_start'

        case types.finish_to_finish:
          return 'finish_to_finish'
        default:
          return ''
      }
    }
    const daysStyle = (date) => {
      if (date === new Date()) {
        return 'today-mark'
      }
      return ''
    }
    // you can use gantt.isWorkTime(date)
    // when gantt.config.work_time config is enabled
    // In this sample it's not so we just check week days

    // if (date.getDay() === 0 || date.getDay() === 6) {
    //   return 'weekend'
    // }

    gantt.templates.scale_row_class = function (scale) {
      switch (scale.unit) {
        case 'day':
          return 'day_scale'

        case 'month':
          return 'month_scale'

        default:
          return 'week_scale'
      }
    }
    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%F' },
      { unit: 'week', step: 1, format: '%W', css: '' },
      { unit: 'day', step: 1, format: '%d', css: daysStyle },
      // { unit: 'hour', step: 1, format: '%h', css: daysStyle },
    ]

    gantt.attachEvent('onGanttReady', () => {
      const tooltips = gantt.ext.tooltips
      tooltips.tooltip.setViewport(gantt.$task_data)
    })
    const dateToStr = gantt.date.date_to_str('%F %j, %Y')

    const today = new Date()
    gantt.addMarker({
      start_date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      css: 'today',
      // text: '今日',
      title: `Today: ${dateToStr(today)}`,
    })
    gantt.config.columns = [
      {
        name: 'task',
        label: 'タスクリスト',
        // resize: true,
        width: 180,
        align: 'center',
        template(item) {
          return `<p class="task-column" style="background-color:" > ${item.text}</p>`
        },
      },
    ]
    const formatMonthScale = gantt.date.date_to_str('%l')

    gantt.attachEvent('onBeforeTaskDisplay', (id, task) => {
      if (this.state.filter === '全て') return true
      if (task.status === this.state.filter) {
        return true
      }
      return false
    })
    gantt.templates.month_scale_date = (date) => formatMonthScale(date)
    gantt.config.autofit = false
    gantt.config.bar_height = 30
    gantt.config.autosize = 'y'
    // const onTaskClick = gantt.attachEvent('onTaskClick', (id) => {
    //   gantt.message(`onTaskClick: Task ID: ${id}`)
    //   return true
    // }, '')
    // gantt.setSizes()
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const formatFirstOfMonth = firstOfMonth.toString('yyyy-MM-dd')
    const formatLastOfMonth = lastOfMonth.toString('yyyy-MM-dd')
    gantt.start_date = formatFirstOfMonth
    gantt.end_date = formatLastOfMonth
    console.log('build')
    setTimeout(scrollToToday, 500)
    gantt.i18n.setLocale('jp')
    gantt.config.show_progress = false
    gantt.attachEvent('onBeforeTaskDrag', () => false)
    gantt.init(this.ganttContainer)
    gantt.parse(tasks)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.filter !== this.state.filter) {
      this.setState({ filter: nextProps.filter })
    }
  }

  componentDidUpdate() {
    gantt.refreshData()
  }

  render() {
    return (
      <>
        <div
          className="gantt-chart_G1-3"
          ref={(input) => {
            this.ganttContainer = input
          }}
          style={{ width: '100%', maxHeight: '700px' }}
        />
        {/* <input type="button" value="Test" onClick={this.test} /> */}
      </>
    )
  }
}

Gantt.propTypes = {
  tasks: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  jobfairStartDate: PropTypes.object.isRequired,
}
export function scrollToToday() {
  const state = gantt.getState()
  const today = new Date()
  let position

  if (state.max_date.getTime() <= today.getTime()) {
    const endDate = gantt.date.add(state.max_date, -1, 'day')
    position = gantt.posFromDate(endDate)
    gantt.scrollTo(position, null)
  } else if (
    state.min_date.getTime() < today.getTime()
    && today.getTime() < state.max_date.getTime()
  ) {
    position = gantt.posFromDate(today)
    const offset = (gantt.$container.offsetWidth - gantt.config.grid_width) / 2
    gantt.scrollTo(position - offset, null)
  }
}

export function taskFilter() {
  // gantt.refreshData()
}
