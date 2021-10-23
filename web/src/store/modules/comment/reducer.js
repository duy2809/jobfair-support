import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'

import types from './types'
import enumsStatus from '~/enums/status'
import _map from 'lodash/map'

//= ============== SELECTOR ===============//
const loadStatus = (state) => state.getIn(['commentReducer', 'loadStatus'])
const comments = (state) => state.getIn(['commentReducer', 'comments'])

export const selectors = {
  loadStatus,
  comments,
}

//= ============== REDUCER ===============//
const initState = fromJS({
  loadStatus: enumsStatus.LOADING,
  comments: [],
})

const loading = (state) => state.set('loadStatus', enumsStatus.LOADING)
const loadSuccess = (state, action) =>
  state.set('loadStatus', enumsStatus.SUCCESS).set('comments', fromJS(action.payload))
const loadFail = (state) => state.set('loadStatus', enumsStatus.FAIL)
const storeData = (state, action) => {
  return state.set('comments', fromJS(action.payload))
}

const reducer = handleActions(
  {
    [types.LOAD_COMMENT]: loading,
    [types.LOAD_COMMENT_SUCCESS]: loadSuccess,
    [types.LOAD_COMMENT_FAIL]: loadFail,
    [types.STORE_COMMENTS]: storeData,
  },
  initState
)

export default reducer
