import React, { Component, useEffect } from 'react'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import './Gantt.css'
import './material.css'
import './export'

export default class Gantt extends Component {
  componentDidMount() {
    const { tasks } = this.props
    console.log(gantt.config.layout)

    // Full List of Extensions
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
    gantt.config.drag_progress = true
    gantt.config.work_time = true
    gantt.config.redo = true
    gantt.config.correct_work_time = true
    gantt.config.autoscroll = true
    gantt.config.autosize = true

    // custom tooltip
    gantt.templates.tooltip_text = (start, end, task) => `<b>Task:</b> ${task.text}<br/><b>Duration:</b> ${task.duration}`

    // custom task text
    gantt.templates.task_text = (start, end, task) => `<b>Milestone:</b> ${task.text},<b> Holders:</b> ${task.users}`

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
    gantt.config.autofit = true
    // gantt.config.grid_width = 500
    gantt.config.click_drag = {
      callback(
        startPosition,
        endPosition,
        startDate,
        endDate,
        tasksBetween,
        rowsBetween,
      ) {
        let parentId = gantt.config.root_id
        if (rowsBetween.length) {
          parentId = rowsBetween[0].id
        }

        gantt.createTask({
          text: 'New task',
          start_date: gantt.roundDate(startDate),
          end_date: gantt.roundDate(endDate),
        }, parentId)
      },
      singleRow: true,
    }
    const dateToStr = gantt.date.date_to_str('%Y-%m-%d %H:%i')
    gantt.templates.format_date = function (date) {
      return dateToStr(date)
    }
    // gantt.templates.lightbox_header = function (start_date, end_date, task) {
    //   return `${gantt.templates.task_time(task.start_date, task.end_date, task)}&nbsp;${
    //     (gantt.templates.task_text(task.start_date, task.end_date, task) || '').substr(0, 70)}`
    // }
    // gantt.templates.grid_blank = function (item) {
    //   return "<div class='gantt_tree_icon gantt_blank'></div>"
    // }

    // custom header
    gantt.templates.lightbox_header = () => 'Them milestone'
    // custom title bar
    gantt.config.lightbox.sections = [
      { name: 'description', height: 38, map_to: 'text', type: 'textarea', focus: true },
      { name: 'priority', height: 22, map_to: 'priority', type: 'select', options: '' },
      { name: 'holder', label: 'Holder', align: 'center' },
      { name: 'time', height: 72, type: 'duration', map_to: 'auto' },
    ]
    gantt.config.columns = [

      // { name: 'text', label: 'Template Milestone', tree: true, width: '*' },
      {
        name: 'progress',
        label: '',
        width: 80,
        align: 'center',
        template(item) {
          // if (item.progress >= 1) return 'Complete'
          // if (item.progress == 0) return 'Not started'
          // return `${Math.round(item.progress * 100)}%`
          return 'Category'
        },
      },
      {
        name: 'assigned',
        label: '',
        align: 'center',
        width: 100,
        template(item) {
          // if (!item.users) return 'Nobody'
          // return item.users.join(', ')
          return 'task'
        },
      },

    ]

    // specifies the delay (in milliseconds) before redrawing the gantt when resizing the container
    gantt.config.container_resize_timeout = 300

    gantt.templates.scale_row_class = function (scale) {
      switch (scale.unit) {
        case 'day':
          return 'day_scale'

        case 'month':
          return 'month_scale'

        default:// "week"
          return 'week_scale'
      }
    }

    gantt.templates.scale_cell_class = function (date) {
      if (!gantt.isWorkTime(date)) return true
    }

    // custom link style
    gantt.templates.link_class = function (link) {
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

    // highlight weekends
    gantt.templates.scale_cell_class = function (date) {
      if (date.getDay() == 0 || date.getDay() == 6) {
        return 'weekend'
      }
    }
    gantt.templates.timeline_cell_class = function (item, date) {
      if (date.getDay() == 0 || date.getDay() == 6) {
        return 'weekend'
      }
    }

    // show percentage of this task
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style='text-align:left;'>${Math.round(task.progress * 100)}% </span>`
    }

    // doi mau task theo tien do
    gantt.templates.task_class = function (start, end, task) {
      if (task.progress > 0.5) {
        return ''
      }
      return 'important'
    }

    // month view
    gantt.config.scale_height = 50
    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%F, %Y' },
      { unit: 'day', step: 1, format: '%j, %D' },
    ]
    // gantt.config.open_split_tasks = true
    gantt.config.min_column_width = 50
    gantt.config.scale_height = 90

    const weekScaleTemplate = function (date) {
      const dateToStr = gantt.date.date_to_str('%d %M')
      const endDate = gantt.date.add(gantt.date.add(date, 1, 'week'), -1, 'day')
      return `${dateToStr(date)} - ${dateToStr(endDate)}`
    }

    const daysStyle = function (date) {
      // you can use gantt.isWorkTime(date)
      // when gantt.config.work_time config is enabled
      // In this sample it's not so we just check week days

      if (date.getDay() === 0 || date.getDay() === 6) {
        return 'weekend'
      }
      return ''
    }

    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%F, %Y' },
      { unit: 'week', step: 1, format: weekScaleTemplate },
      { unit: 'day', step: 1, format: '%D', css: daysStyle },
    ]
    gantt.templates.quick_info_content = function (start, end, task) {
      return task.details || task.text
    }
    gantt.i18n.setLocale('jp')

    gantt.init(this.ganttContainer)
    // load data
    gantt.parse(tasks)
  }

    exportExcel = () => {
      gantt.exportToExcel({
        name: 'document.xlsx',
        data: [
          { id: 1, text: 'Project #1', start_date: '01-04-2020', duration: 18 },
          { id: 2, text: 'Task #1', start_date: '02-04-2020', duration: 8, parent: 1 },
          { id: 3, text: 'Task #2', start_date: '11-04-2020', duration: 8, parent: 1 },
        ],
      })
    }

    importExcel = (file) => {
      gantt.importFromExcel({

        data: file,
        sheet: 2, // print third sheet
        callback(rows) {},
      })
    }

    render() {
      return (

        <>
          <div
            ref={(input) => { this.ganttContainer = input }}
            style={{ width: '100%', height: '900px' }}
          />
          <input type="button" value="Export" onClick={this.exportExcel} />

        </>
      )
    }
}
