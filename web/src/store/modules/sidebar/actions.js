import { createAction } from 'redux-actions'
import { put, takeLatest } from 'redux-saga/effects'
import types from './types'

//= ============== ACTIONS ===============//
const load = createAction(types.LOAD_SIDEBAR_STATUS)
const loadSuccess = createAction(types.LOAD_SIDEBAR_STATUS_SUCCESS)
const loadFail = createAction(types.LOAD_SIDEBAR_STATUS_FAIL)
const storeData = createAction(types.STORE_SIDEBAR_STATUS)
const clearStore = createAction(types.CLEAR_STORE)
export const actions = {
  load,
  storeData,
  clearStore,
}

//= =============== SAGAS ===============//
export function* sagas() {
  yield takeLatest(types.LOAD_SIDEBAR_STATUS, initStatus)
  yield takeLatest(types.STORE_SIDEBAR_STATUS, updateStore)
  yield takeLatest(types.CLEAR_STORE, updateStore)
}

function* initStatus() {
  try {
    const status = {
      collapsed: false,
      selected: 1,
    }
    yield put(storeData(status))
    yield put(loadSuccess(status))
  } catch (error) {
    yield put(loadFail())
  }
}

function* updateStore({ payload }) {
  try {
    yield put(storeData(payload))
    yield put(loadSuccess(payload))
  } catch (error) {
    yield put(loadFail())
  }
}
