import express from 'express'
import cookie from 'cookie-parser'
import bodyParser from 'body-parser'
import csrf from 'csurf'
import session from './libs/session'

export default ({ publicDir = 'public' } = {}) => {
  const app = express()

  app.disable('x-powered-by')

  app.use(session)
  app.use(cookie())
  app.use(bodyParser.json())
  app.use(csrf({ cookie: true }))

  // Host static files for Next.js:
  app.use(express.static(publicDir))

  return app
}
