import echo from '../connection'

export default class CommentChannel {
  constructor() {
    this.channel = echo.channel(`laravel_database_comment-channel`)
    this.onOutputCb = null
  }

  listen() {
    this.channel.notification((output) => {
      this.onOutputCb(output)
    })

    return this
  }

  leave() {
    echo.leave(this.channel.name)
  }

  onOutput(cb) {
    this.onOutputCb = cb
    return this
  }
}
