import _first from 'lodash/first'
import { redirect } from '~/modules/http'
import { preURL } from '~/api/authenticate'

const handle = async ({ store, res, args = [], isLast }) => {
  const user = store.getState().get('auth').get('user')
  const userRole = user ? user.get('role') : null
  const isGuest = user === null || user.size === 0

  const role = _first(args) || 'member'
  const hasRole = userRole === role
  if (isGuest || (!hasRole && isLast)) {
    if (res !== undefined) {
      if (res.req.url !== '/') {
        const req = res.req.url
        await preURL(req).then(() => {
        })
      }
    }
    redirect('/', { res })
  }

  return { continue: true }
}

export default handle
