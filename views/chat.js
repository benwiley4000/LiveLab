'use strict'
const html = require('choo/html')
const input = require('./components/input.js')

module.exports = chatView

function chatView (state, emit) {
  return html`

    <div class="pa2 dib">
      <div class="h5 overflow-y-scroll">
        ${state.ui.chat.messages.map((obj)=>{
          return html`
            <tr>
              <th class="pa1">${obj.nickname}:</th>
              <td class="pa1">${obj.message}</td>
            </tr>
          `
        })}
      </div>
      ${input('', 'message', {
        value: state.ui.chat.current,
        onkeyup: (e) => (emit('ui:updateChat', e.target.value))
      })}
      <div class="f6 fr ma2 link ph3 pv2 mb2 white bg-dark-pink pointer" onclick=${() => (emit('ui:sendChatMessage'))}>Send</div>
    </div>
    `
}
