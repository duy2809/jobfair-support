import { combineReducers } from 'redux-immutable'

import { reducers as auth } from './modules/auth'
import exampleReducer from './modules/example'
import commentReducer from './modules/comment'

export default combineReducers({
  auth,
  exampleReducer,
  commentReducer,
})
