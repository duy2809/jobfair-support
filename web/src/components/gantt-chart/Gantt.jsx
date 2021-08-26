import React, { Component, useEffect } from 'react'

import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import './Gantt.css'
import './material.css'
import './style.scss'
import './export'

export default class Gantt extends Component {
  componentDidMount() {
    const { tasks } = this.props

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
    gantt.config.min_column_width = 40
    gantt.config.scale_height = 120
    gantt.config.drag_progress = true
    gantt.config.show_markers = true
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
    gantt.config.lightbox.sections = []
    gantt.attachEvent('onBeforeLightbox', () => false)
    const weekScaleTemplate = (date) => {
      // const dateToStr = gantt.date.date_to_str('%d %M')
      const dateToStr = 'マイルストーン名'
      // const endDate = gantt.date.add(gantt.date.add(date, 1, 'week'), -1, 'day')
      return `<div style="display:flex" >
                  
           
                  <div class="milestone-row" id="${tasks}" style="width:100%" >${dateToStr}</div>
               
              </div>`
    }
    // custom link style
    gantt.templates.link_class = (link) => {
      const types = gantt.config.links
      switch (link.type) {
        case types.finish_to_start:
          return 'finish_to_start'

        case types.start_to_start:
          return 'start_to_start'

        case types.finish_to_finish:
          return 'finish_to_finish'
        default:
          return ''
      }
    }
    const daysStyle = (date) =>
    // you can use gantt.isWorkTime(date)
    // when gantt.config.work_time config is enabled
    // In this sample it's not so we just check week days

      // if (date.getDay() === 0 || date.getDay() === 6) {
      //   return 'weekend'
      // }
      ''

    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%F' },
      { unit: 'week', step: 1, format: weekScaleTemplate },
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
      start_date: today,
      css: 'today',
      text: '今日',
      title: `Today: ${dateToStr(today)}`,
    })
    gantt.config.columns = [
      {
        name: 'task',
        label: '',
        resize: true,
        width: 170,
        align: 'center',
        template(item) {
          return `<p class="task-column">タスク ${item.id}</p>`
        },
      },

    ]
    const formatMonthScale = gantt.date.date_to_str('%l')

    gantt.templates.month_scale_date = (date) => formatMonthScale(date)
    gantt.config.autofit = true
    gantt.config.bar_height = 30
    gantt.config.autosize = 'y'
    // const onTaskClick = gantt.attachEvent('onTaskClick', (id) => {
    //   gantt.message(`onTaskClick: Task ID: ${id}`)
    //   return true
    // }, '')
    // gantt.setSizes()
    const parsed = Date.parse(today)
    console.log(new Date(today.getFullYear(), today.getMonth(), 1))
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const formatFirstOfMonth = firstOfMonth.toString('yyyy-MM-dd')
    const formatLastOfMonth = lastOfMonth.toString('yyyy-MM-dd')
    gantt.start_date = formatFirstOfMonth
    gantt.end_date = formatLastOfMonth

    setTimeout(() => {
      const state = gantt.getState()

      console.log(state.max_date)
    }, 1000)
    gantt.scrollTo(1000, 1000)
    setTimeout(scrollToToday, 500)
    gantt.i18n.setLocale('jp')
    gantt.config.show_progress = false
    gantt.attachEvent('onBeforeTaskDrag', () => false)
    gantt.init(this.ganttContainer)
    gantt.parse(tasks)
    gantt.scrollTo(30, 80)
  }

  render() {
    return (

      <>
        <div
          className="gantt-chart_G1-3"
          ref={(input) => { this.ganttContainer = input }}
          style={{ width: '100%', maxHeight: '650px' }}
        />
        {/* <input type="button" value="Export" onClick={this.exportExcel} /> */}

      </>
    )
  }
}
export function scrollToToday() {
  const state = gantt.getState()
  const today = new Date()
  let position

  if (state.max_date.getTime() <= today.getTime()) {
    const endDate = gantt.date.add(state.max_date, -1, 'day')
    position = gantt.posFromDate(endDate)
    gantt.scrollTo(position, null)
  } else if (state.min_date.getTime() < today.getTime() && today.getTime() < state.max_date.getTime()) {
    position = gantt.posFromDate(today)
    const offset = (gantt.$container.offsetWidth - gantt.config.grid_width) / 3
    gantt.scrollTo(position - offset, null)
  }
}
