import { all, fork } from 'redux-saga/effects'
import { sagas as auth } from './modules/auth'
import { exampleSagas } from './modules/example'
import { commentSagas } from './modules/comment'
import { sidebarSagas } from './modules/sidebar'

export default function* rootSaga() {
  yield all([fork(auth), fork(exampleSagas), fork(commentSagas), fork(sidebarSagas)])
}
