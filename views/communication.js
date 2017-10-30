'use strict'
const html = require('choo/html')
const VideoEl = require('./components/videocontainer.js')
const AudioEl = require('./components/audiocontainer.js')
const slider = require("./components/slider.js")

const MAX_NUM_PEERS = 8 // can be changed (stub for initializing video containers)

module.exports = communicationView

// initialize peer video holders
var peerEls = []
for (var i = 0; i < MAX_NUM_PEERS; i++) {
  peerEls[i] = { vidEl: new VideoEl(), audEl: new AudioEl() }
}

function communicationView (state, emit) {
  // create containers for each
  var communicationContainers = peerEls.map(function (elements, index) {
    var peerIndex = state.peers.all[index]
    if (peerIndex) {
      var videoId = state.peers.byId[peerIndex].defaultTracks.video
      var audioId = state.peers.byId[peerIndex].defaultTracks.audio
      return html`
      <div class="fl w-50 pa1" id="commDiv_${peerIndex}">
        ${elements.vidEl.render({
          htmlProps: {
            onclick: videoSwitch,
            class: 'h-50 w-100'
          },
          track: (videoId in state.media.byId)  ? state.media.byId[videoId].track : null,
          id: (videoId in state.media.byId) ?  state.media.byId[videoId].track.id : null
        })}
        ${elements.audEl.render({
          htmlProps: {
            class: 'h4 w4'
          },
          track: (audioId in state.media.byId)  ? state.media.byId[audioId].track : null,
          id: (audioId in state.media.byId) ?  state.media.byId[audioId].track.id : null
        })}
        ${slider({
          label: 'volume',
          onChange: audioVolume,
          min: 0.0,
          max: 1.0,
          step: 0.01,
          value: state.peers.byId[peerIndex].defaultAudioVolume
        })}
        <p> ${state.peers.byId[peerIndex].nickname}</p>
      </div>`

      function audioVolume (e) {
        var audioEl = document.querySelector('div#commDiv_' + CSS.escape(peerIndex) + ' > audio')
        var opts = {peer: peerIndex, volume: e.target.value}
        emit('peers:changeDafultVolume', opts)
        audioEl.volume = e.target.value
        if (audioEl.muted )audioEl.muted = false
      }

      function videoSwitch (e) {
        var videoId = state.peers.byId[peerIndex].defaultTracks.video
        if (state.devices.popupwindows[videoId]) {
          state.devices.popupwindows[videoId].focus()
        } else {console.log('no win')}
      }
    
    } else {
      return null
    }
  })

  return html`
    <div>
      ${communicationContainers}
    </div>
    `
}
