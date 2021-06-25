import { fromJS } from 'immutable'
import { call, put, takeLatest } from 'redux-saga/effects'
import { createAction, handleActions } from 'redux-actions'
import _map from 'lodash/map'
import { webInit } from '~/api/web-init'

const initialState = fromJS({
  user: null,
  loaded: false,
})

// Action Types
export const LOAD = 'auth/LOAD'
export const LOAD_SUCCESS = 'auth/LOAD_SUCCESS'
export const GET_AUTH = 'auth/GET_AUTH'

// Actions
export const load = createAction(LOAD)
export const loadSuccess = createAction(LOAD_SUCCESS)

// Sagas
function* init({ next }) {
  const { data: { auth } } = yield call(webInit)

  try {
    yield put(loadSuccess(auth.user))
    next(auth.user)
  } catch (error) {
    yield put(loadSuccess({}))
    next(null)
  }
}

export function* sagas() {
  yield takeLatest(LOAD, init)
}

// Reducers
const handleLoadSuccess = (state, action) => state.set('loaded', true)
  .set('user', fromJS(action.payload))

const auth = (state) => state.get('auth').get('user')
const roles = (state) => _map(state.get('auth').getIn('user.roles'), 'name')

export const selectors = {
  auth,
  roles,
}

export const reducers = handleActions({
  [LOAD_SUCCESS]: handleLoadSuccess,
}, initialState)
