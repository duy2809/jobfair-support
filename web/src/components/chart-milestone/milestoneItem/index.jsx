/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import './style.scss'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'

const MilestoneItem = ({ milestoneName, dealine, width }) => (
  <>
    <div className="milestone__Item">
      <div className="Mile__title">
        <h5 style={{ color: '#2d334a' }}>{milestoneName}</h5>
        <h5 style={{ color: '#2d334a' }}>{dealine}</h5>
      </div>
      <div className="mile__chart">
        <div className="chart__stt">
          <Tooltip placement="top" title="未着手">
            <div className="new" style={{ width: `${width.new}%` }} />
          </Tooltip>
          <Tooltip placement="top" title="進行中">
            <div className="in__propress" style={{ width: `${width.propress}%` }} />
          </Tooltip>
          <Tooltip placement="top" title="完了">
            <div className="done" style={{ width: `${width.done}%` }} />
          </Tooltip>
          <Tooltip placement="top" title="中断">
            <div className="pending" style={{ width: `${width.pending}%` }} />
          </Tooltip>
          <Tooltip placement="top" title="未完了">
            <div className="break" style={{ width: `${width.break}%` }} />
          </Tooltip>

        </div>

      </div>
    </div>
  </>

)
MilestoneItem.propTypes = {
  milestoneName: PropTypes.string.isRequired,
}
MilestoneItem.propTypes = {
  dealine: PropTypes.string.isRequired,
}
MilestoneItem.propTypes = {
  width: PropTypes.object.isRequired,
}
export default MilestoneItem
