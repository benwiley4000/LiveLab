'use strict'

const html = require('choo/html')
const input = require('./components/input.js')
const button = require('./components/button.js')
const Dropdown = require('./components/dropdown.js')
const VideoEl = require('./components/VideoContainer.js')

module.exports = loginView

const audioDropdown = Dropdown()
const videoDropdown = Dropdown()
const defaultVid = VideoEl()
// const demoVideo = Video()

function loginView (state, emit) {
//   console.log("media ", state.media)

  var audioinput = state.devices.audioinput
  var videoinput = state.devices.videoinput
  var defaultAudio = state.devices.default.audioinput
  var defaultVideo = state.devices.default.videoinput
  var getCheck = state.user.uselocal

  return html`
  <div>
    <div>
     ${defaultVid.render({
       htmlProps: {
         class: 'w-100 h-100'
       },
       track: state.media.byId[state.media.default.video]
     })}
    </div>
    <div class="vh-100 dt w-100 fixed top-0 left-0">
      <div class="dtc v-mid">
        <div class="w-40 center">    
          <legend class="f1 fw6 ph0 mh0">LIVE LAB</legend>
          <legend class="f4 fw6 ph0 mh0">Join Session</legend>
          ${input('Nickname', 'how you will appear to everyone else', {
            value: state.peers.byId[state.user.uuid].nickname,
            onkeyup: setNickname
          })}
          ${input('Room', 'room name', {
            value: state.user.room,
            onkeyup: setRoom
          })}
          ${input('Signalling server', 'e.g. http://server.glitch.me', {
            value: state.user.server,
            onkeyup: setServer
          })}
          ${button('Remote/Local signalling', 'Remote Signaling', {
            value: state.user.uselocal,
            onmouseup: useLocal,
            class: 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-auto',
            divclass: 'fl pr3 pb4'
          })}
          ${input('Local port', '8000', {
            value: state.user.localport,
            onchange: setLocalPort,
            class: 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-30',
            divclass: 'fl pb4'
          })}
          <legend class="f4 fw6 ph0 mh0">Choose Default Input Devices</legend>
          ${audioDropdown.render({
            value: 'Audio:  ' + (defaultAudio === null ? '' : audioinput.byId[defaultAudio].label),
            options: audioinput.all.map((id) => (
              {
                value: id,
                label: audioinput.byId[id].label
              }
            )),
            onchange: (value) => {
              emit('devices:setDefaultAudio', value)
            }
          })}
          ${videoDropdown.render({
            value: 'Video:  ' + (defaultVideo === null ? '' : videoinput.byId[defaultVideo].label),
            options: videoinput.all.map((id) => (
              {
                value: id,
                label: videoinput.byId[id].label
              }
            )),
            onchange: (value) => {
              emit('devices:setDefaultVideo', value)
            }
          })}
          <div class="f6 link dim ph3 pv2 mb2 dib white bg-dark-pink pointer" onclick=${() => (emit('user:join'))}>Join</div>
          <div> ${state.user.statusMessage} </div>
        </div>
      </div>
    </div>
  </div>
  `
  function setNickname (e) {
    emit('user:setNickname', e.target.value)
  }

  function setRoom (e) {
    emit('user:setRoom', e.target.value)
  }

  function setServer (e) {
    emit('user:setServer', e.target.value)
  }

  function setLocalPort (e) {
    emit('user:setLocalPort', e.target.value)
  }

  function useLocal (e) {
    if (e.target.value == 'Local Signaling') {
      emit('user:useLocal', 'Remote Signaling')
    } else {emit('user:useLocal', 'Local Signaling')}
  }   
}
