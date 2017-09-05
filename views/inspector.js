'use strict'
const html = require('choo/html')
const RTCInspector = require('./components/RTCInspector.js')
const VideoEl = require('./components/VideoContainer.js')

module.exports = inspectorComponent

const inspector = RTCInspector()
const previewVid = VideoEl()

function inspectorComponent (state, emit) {
  var popupWindow = null
  var name = state.media.byId[state.ui.inspector.trackId].track.id
  if (state.devices.popupwindows[name]) {
    popupWindow = state.devices.popupwindows[name]
  }

  return  html`<div class="h5 overflow-scroll pa2">
    ${state.media.byId[state.ui.inspector.trackId].track.kind==='video' ? previewVid.render({
      htmlProps: {
        class: 'h4 w4'
      },
      track: (state.ui.inspector.trackId in state.media.byId)  ? state.media.byId[state.ui.inspector.trackId].track : null,
      id: (state.ui.inspector.trackId in state.media.byId) ?  state.media.byId[state.ui.inspector.trackId].track.id : null
    }) : null }

    ${state.media.byId[state.ui.inspector.trackId].track.kind==='video' && popupWindow!==null ? html`<div class="f6 link dim ph3 pv2 mb2 dib white bg-dark-pink pointer" id="popupDiv" onclick=${() => (popupWin())}>Close Window</div>`
    : null }
    ${state.media.byId[state.ui.inspector.trackId].track.kind==='video' && popupWindow===null ? html`<div class="f6 link dim ph3 pv2 mb2 dib white bg-dark-pink pointer" id="popupDiv" onclick=${() => (popupWin())}>Open Window</div>`
    : null }

    ${state.media.byId[state.ui.inspector.trackId].peerId===state.user.uuid && state.media.byId[state.ui.inspector.trackId].name!=='default' ? html`<div class="f6 link dim ph3 pv2 mb2 dib white bg-dark-pink pointer" id="remove" onclick=${() => (emit('media:removeTrack', state.ui.inspector.trackId))}>Remove Broadcast</div>`
    : null }

  </div>`
  //   ${inspector.render({
  //     htmlProps: {

  //     },
  //     pc: state.ui.inspector.pc,
  //     trackId: state.ui.inspector.trackId
  //   })}
  function popupWin () {
    var vidEl = document.querySelector('div#inspectorDiv > video')
    var el = document.querySelector('div#popupDiv')
    var ip = window.location.host

    if (el.innerHTML == 'Open Window') {
      popupWindow = window.open("https://" + ip + "/show.html", 'Win_' + name, 'fullscreen=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no')
      state.devices.popupwindows[name] = popupWindow
      popupWindow.onload = function(){
        var winEl = popupWindow.document.getElementById('showVideo')
        winEl.srcObject = vidEl.srcObject
        winEl.onloadedmetadata = function(){
          popupWindow.resizeTo(winEl.videoWidth, winEl.videoHeight)
        }
      }
      popupWindow.onclose = function(){
        delete state.devices.popupwindows[name]
        el.innerHTML = 'Open Window'
      }
      el.innerHTML = 'Close Window'
    } else {
      popupWindow.close()
      delete state.devices.popupwindows[name]
      el.innerHTML = 'Open Window'
    }
  }
}
