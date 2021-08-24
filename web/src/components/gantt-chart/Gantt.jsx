import React, { Component, useEffect } from 'react'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import './Gantt.css'
import './material.css'
import './export'
import { CopyrightCircleFilled } from '@ant-design/icons'

export default class Gantt extends Component {
  componentDidMount() {
    const { tasks } = this.props

    /* Full List of Extensions */
    gantt.plugins({
      click_drag: true,
      // drag_timeline: true,
      tooltip: true,
      overlay: true,
      auto_scheduling: true,
      fullscreen: true,
      keyboard_navigation: true,
      multiselect: true,
      quick_info: true,
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
    const weekScaleTemplate = (date) => {
      // const dateToStr = gantt.date.date_to_str('%d %M')
      const dateToStr = 'マイルストーン名'
      // const endDate = gantt.date.add(gantt.date.add(date, 1, 'week'), -1, 'day')
      return `<div style="display:flex" >
                  <div  style="background-color:pink ;width:50%" >0</div>
                  <div style="background-color:blue ; width:30%" > 1 </div>
                  <div style="background-color:red ; width:30%" > 2 </div>
                  <div style="background-color:red ; width:30%" > 3 </div>
                  <div style="background-color:red ; width:30%" > 4 </div>
                  <div style="background-color:red ; width:30%" > 5 </div>
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
    ]
    gantt.ext.quickInfo.setContainer(gantt.ext.quickInfo.getNode())
    // const quickInfo = gantt.ext.quickInfo
    // console.log(quos);
    // const task = gantt.getTask(0)
    // // quickInfo.show(task.id)
    // quickInfo.setContent({
    //   // taskId: task.id,
    //   header: {
    //     title: 'he',
    //     date: 'meme',
    //   },
    //   content: 'jashdfj',
    //   buttons: [],
    // })
    const dateToStr = gantt.date.date_to_str(gantt.config.task_date)

    const id = gantt.addMarker({
      start_date: new Date(),
      css: 'today',
      text: 'Now',
      title: dateToStr(new Date()),
    })
    setInterval(() => {
      const today = gantt.getMarker(id)
      today.start_date = new Date()
      today.title = 'Now'
      gantt.updateMarker(id)
    }, 1000 * 1)

    // alert(new Date())
    gantt.getMarker(id) // ->{css:"today", text:"Now", id:...}

    gantt.attachEvent('onBeforeTaskDrag', () => false)
    gantt.init(this.ganttContainer)
    gantt.parse(tasks)
  }

  render() {
    return (

      <>
        <div
          ref={(input) => { this.ganttContainer = input }}
          style={{ width: '100%', height: '500px' }}
        />
        <input type="button" value="Export" onClick={this.exportExcel} />

      </>
    )
  }
}
