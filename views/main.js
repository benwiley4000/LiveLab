'use strict'

const html = require('choo/html')
const login = require('./login.js')
const session = require('./session.js')
// const mediaList = require('./mediaList.js')

module.exports = mainView

function mainView (state, emit) {
  if (!state.user.loggedIn) {
    return html`
    <div>
    ${login(state, emit)}
    </div>
    `
  } else {
    return html`
    <div>
      ${session(state, emit)}
    </div>
    `
  }
}
