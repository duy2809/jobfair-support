import React, { Component, useEffect } from 'react'

import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import './Gantt.css'
import './material.css'
import './style.scss'
import './export'
import { CopyrightCircleFilled } from '@ant-design/icons'

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
    gantt.config.min_column_width = 50
    gantt.config.scale_height = 100
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
      console.log(tasks)
      // const endDate = gantt.date.add(gantt.date.add(date, 1, 'week'), -1, 'day')
      return `<div style="display:flex" >
                  
           
                  <div class="milestone-row" id="${tasks}" style="background-color:pink ;width:70%" >1</div>
               
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
    const daysStyle = (date) => {
      // you can use gantt.isWorkTime(date)
      // when gantt.config.work_time config is enabled
      // In this sample it's not so we just check week days

      if (date.getDay() === 0 || date.getDay() === 6) {
        return 'weekend'
      }
      return ''
    }
    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%F' },
      { unit: 'week', step: 1, format: weekScaleTemplate },
      { unit: 'day', step: 1, format: '%d', css: daysStyle },
      // { unit: 'hour', step: 1, format: '%h', css: daysStyle },
    ]

    // const dateToStr = gantt.date.date_to_str(gantt.config.task_date)

    // const id = gantt.addMarker({
    //   start_date: new Date(),

    //   text: 'Today',
    //   title: dateToStr(new Date()),
    // })

    // setInterval(() => {
    //   const today = gantt.getMarker(id)
    //   today.start_date = new Date()
    //   today.title = 'Now'
    //   gantt.updateMarker(id)
    // }, 1000 * 1)
    // gantt.getMarker(id)
    gantt.attachEvent('onGanttReady', () => {
      const tooltips = gantt.ext.tooltips
      tooltips.tooltip.setViewport(gantt.$task_data)
    })
    const dateToStr = gantt.date.date_to_str('%F %j, %Y')
    console.log(new Date())
    const today = new Date()
    gantt.addMarker({
      start_date: today,
      css: 'today',
      text: 'Today',
      title: `Today: ${dateToStr(today)}`,
    })
    gantt.config.columns = [
      {
        name: `task-${1}`,
        label: '',
        width: 300,
        align: 'start',
        template(item) {
          return `Task ${item.id}`
        },
      },

    ]
    gantt.config.autofit = true
    gantt.config.bar_height = 30
    gantt.config.autosize = 'y'

    gantt.i18n.setLocale('jp')
    gantt.attachEvent('onBeforeTaskDrag', () => false)
    gantt.init(this.ganttContainer)
    gantt.parse(tasks)
  }

  render() {
    return (

      <>
        <div
          ref={(input) => { this.ganttContainer = input }}
          style={{ width: '100%', minHeight: 500 }}
        />
        <input type="button" value="Export" onClick={this.exportExcel} />

      </>
    )
  }
}
