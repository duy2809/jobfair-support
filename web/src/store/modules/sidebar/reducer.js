import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'

import types from './types'
import enumsStatus from '~/enums/status'

//= ============== SELECTOR ===============//
const loadStatus = (state) => state.getIn(['sidebar', 'loadStatus'])
const status = (state) => state.getIn(['sidebar', 'status'])

export const selectors = {
  loadStatus,
  status,
}

//= ============== REDUCER ===============//
const initState = fromJS({
  loadStatus: enumsStatus.LOADING,
  status: {
    collapsed: false,
    selected: 1,
  },
})

const loading = (state) => state.set('loadStatus', enumsStatus.LOADING)
const loadSuccess = (state, action) => state.set('loadStatus', enumsStatus.SUCCESS).set('status', fromJS(action.payload))
const loadFail = (state) => state.set('loadStatus', enumsStatus.FAIL)
const storeData = (state, action) => state.set('status', fromJS(action.payload))

const reducer = handleActions(
  {
    [types.LOAD_SIDEBAR_STATUS]: loading,
    [types.LOAD_SIDEBAR_STATUS_SUCCESS]: loadSuccess,
    [types.LOAD_SIDEBAR_STATUS_FAIL]: loadFail,
    [types.STORE_SIDEBAR_STATUS]: storeData,
    [types.CLEAR_STORE]: storeData,
  },
  initState
)

export default reducer
