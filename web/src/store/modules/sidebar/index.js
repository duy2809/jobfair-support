import types from './types'
import { sagas, actions } from './actions'
import reducer, { selectors } from './reducer'

export default reducer

export {
  types as sidebarTypes,
  sagas as sidebarSagas,
  actions as sidebarActions,
  selectors as sidebarSelectors,
}
