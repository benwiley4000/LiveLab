'use strict'

const html = require('choo/html')
const communication = require('./communication.js')
const showControl = require('./showControl.js')
// const allVideos = require('./allVideos.js')
const mediaList = require('./mediaList.js')
const panel = require('./components/panel.js')
const chat = require('./components/chat.js')
const osc = require('./components/osc.js')
const windowManager = require('./windowmanager.js')
const AddBroadcast = require('./addBroadcast.js')
const ConfigureOsc = require('./configureOscForwarding')
const AddOscBroadcast = require('./addOscBroadcast')

module.exports = workspaceView
//  <!--${AddBroadcast(state, emit)}-->
//  ${login(state, emit)}
// ${allVideos(state, emit)}
//contents: mediaList(state, emit),

function workspaceView (state, emit) {
  var oscEl = ''
  if(state.osc.enabled==true){
    oscEl = panel(
         {
           htmlProps: {
             class: "w-100"
           },
           contents: osc(state, emit),
           closable: false,
           header:   "OSC"
         }
       )
  }


    return html`
    <div class="f6 dt fw2 w-100 h-100 mw-100">
        <div class="fl w-70-ns h-100 workspace">
          <div class = "tab-header">
            ${state.ui.tabs.map((el, index) =>
              html`<div
                    class="tab-element ${state.ui.selectedTab === index ? 'selected' : ''}"
                    onclick=${() => (emit('ui:setTab', index))}
                    >${el}</div>`
            )}
          </div>
          <div class="w-100 pa2">
            <h2 class="pa2">
              In room: <i>${state.user.room}</i> (tell others to join this room!)
            </h1>
            ${state.ui.selectedTab === 0 ? communication(state, emit) : showControl(state, emit)}
          </div>
        </div>
      <div class="fl w-30-ns w-100 mw6 h-100">
        ${panel(
          {
            htmlProps: {
              class: "w-100"
            },
            contents: mediaList(state, emit),
            closable: false,
            header:   "Shared Media"
          }
        )}
        ${panel(
          {
               htmlProps: {
                 class: "w-100"
               },
               contents: chat(state, emit),
               closable: false,
               header:   "Chat"
             }
           )}
         ${oscEl}
      </div>
      ${AddBroadcast(state.devices, emit, state.devices.addBroadcast.active)}
      ${ConfigureOsc(state.osc.configureForwarding, emit, state.osc.configureForwarding.visible)}
      ${AddOscBroadcast(state.osc.addBroadcast, emit, state.osc.addBroadcast.visible)}
    </div>
    `
}
