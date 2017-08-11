'use strict'
const html = require('choo/html')
const VideoEl = require('./components/videocontainer.js')
const AudioEl = require('./components/audiocontainer.js')
const button = require('./components/button.js')
const range = require('./components/range.js')

const MAX_NUM_PEERS = 8 // can be changed (stub for initializing video containers)

module.exports = sessionView

function sessionView (state, emit) {
  // initialize peer video holders
  var peerVids = []
  for (var i = 0; i < MAX_NUM_PEERS; i++) {
    peerVids[i] = new VideoEl()
  }

  var peerAuds = []
  for (var i = 0; i < MAX_NUM_PEERS; i++) {
    peerAuds[i] = new AudioEl()
  }

  // create containers for each
  var sessionVids = peerVids.map(function (vidEl, index) {
    var peerIndex = state.peers.all[index]
    if (peerIndex) {
      var videoId = state.peers.byId[peerIndex].defaultTracks.video
      if (videoId != null) {
        return html`
        <div class="dib w-25 h-inherit">
          <p> ${state.peers.byId[peerIndex].nickname}</p>
          ${vidEl.render({
            htmlProps: {
              id: videoId,
              class: 'w-100'
            },
            track: state.media.byId[videoId]
          })}

          ${button('', 'Popup Window', {
            value: 'Open Window',
            name: videoId,
            onmouseup: popupWindow,
            class: 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-auto',
            divclass: 'dib pr3 pb4'
          })}
          ${button('', 'Full Screen', {
            value: 'Full Screen',
            name: videoId,
            onmouseup: fullscreenWindow,
            class: 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-auto',
            divclass: 'dib pr3 pb4'
          })}

        </div>`
      }
    } else {
      return null
    }
  })

  var sessionAuds = peerAuds.map(function (audEl, index) {
    var peerIndex = state.peers.all[index]
    if (peerIndex) {
      var audioId = state.peers.byId[peerIndex].defaultTracks.audio
      if (audioId != null) {
        return html`
        <div class="dib w-25 h-inherit">
          <p> ${state.peers.byId[peerIndex].nickname}</p>
          ${audEl.render({
            htmlProps: {
              id: audioId
            },
            track: state.media.byId[audioId]
          })}
          ${range('', 'Level', {
            value: 0.0,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            name: audioId,
            oninput: audioLevel,
            class: 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-auto',
            divclass: 'dib pr3 pb4'
          })}        
        </div>`
      }
    } else {
      return null
    }
  })

  function hangup (e) {
    emit('user:hangup', 'hangup')
  }

  function popupWindow (e) {
    emit('devices:popupWindow', e.target)
  }

  function fullscreenWindow (e) {
    emit('devices:fullscreenWindow', e.target)
  }

  function audioLevel (e) {
    emit('devices:audioLevel', e.target)
  }

  return html`
    <div>
      <div class="dib w-100 max-h-75">
      <p>VIDEO</p>
        ${sessionVids}
      </div>
      <div class="dib w-100 max-h-25">
      <p>AUDIO</p>
        ${sessionAuds}
      </div>
    </div> 
    `
}

//   return html`
//     <div>
//       ${sessionVids}
//       ${sessionAuds}
//       ${button('', 'Hangup', {
//         value: 'Hangup',
//         onmouseup: hangup,
//         class: 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-auto',
//         divclass: 'fl pr3 pb4'
//       })}
//     </div> 
//     `
// }
