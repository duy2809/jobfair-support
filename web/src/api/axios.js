import axios from 'axios'
import _assign from 'lodash/assign'

const instance = axios.create({
  baseURL: process.browser ? process.env.BROWSER_API_URL : require('../../config/next').SERVER_API_URL,
})

if (!process.browser) {
  instance.interceptors.request.use((config) => _assign({}, config, {
    url: decodeURI(config.url) === config.url ? encodeURI(config.url) : config.url,
  }))
}

export default instance
