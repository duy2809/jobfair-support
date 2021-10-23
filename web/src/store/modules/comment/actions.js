import { put, call, takeLatest } from 'redux-saga/effects'
import { createAction } from 'redux-actions'
import types from './types'
import * as commentAPI from '~/api/comment'
//= ============== ACTIONS ===============//
const load = createAction(types.LOAD_COMMENT)
const loadSuccess = createAction(types.LOAD_COMMENT_SUCCESS)
const loadFail = createAction(types.LOAD_COMMENT_FAIL)
const storeData = createAction(types.STORE_COMMENTS)

export const actions = {
  load,
  storeData,
}

//= =============== SAGAS ===============//
export function* sagas() {
  yield takeLatest(types.LOAD_COMMENT, fetchData)
}

function* fetchData({ payload }) {
  try {
    const { data: response } = yield call(commentAPI.getComments, ...payload)

    yield put(storeData(response))
    yield put(loadSuccess(response))
    // action.next(response)
  } catch (error) {
    console.log(error)
    yield put(loadFail())
  }
}
