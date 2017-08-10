'use strict'

const html = require('choo/html')
const Modal = require('./components/modal.js')
const Dropdown = require('./components/dropdown.js')
const VideoEl = require('./components/VideoContainer.js')
const radioSelect = require('./components/radioSelect.js')
const settingsUI = require('./components/settingsUI.js')

module.exports = addBroadcast

const deviceDropdown = Dropdown()
const previewVid = VideoEl()

function addBroadcast (devices, emit, showElement) {
  var bState = devices.addBroadcast
  var constraintOptions

  var defaultLabel = ''
  if(bState[bState.kind].deviceId !== null){
    var selectedDevice = bState[bState.kind].deviceId
    defaultLabel += devices[bState.kind+'input'].byId[selectedDevice].label
  }

  if(bState.kind==="audio") {
    constraintOptions = html`
    <div id="audio-constraints" >
          ${deviceDropdown.render({
            value: 'Device:  ' + defaultLabel,
            options: devices.audioinput.all.map((id) => (
              {
                value: id,
                label: devices.audioinput.byId[id].label
              }
            )),
            onchange: (value) => {
              emit('devices:updateBroadcastDevice', {deviceId: value})
            }
          })}
          ${settingsUI({
              onChange: updateBroadcastConstraints,
              settings: bState.audio
            })
          }
    </div>

    `
  } else {
    constraintOptions = html`
    <div id="video-constraints">
      ${deviceDropdown.render({
        value: 'Device:  ' + defaultLabel,
        options: devices.videoinput.all.map((id) => (
          {
            value: id,
            label: devices.videoinput.byId[id].label
          }
        )),
        onchange: (value) => {
          emit('devices:updateBroadcastDevice', {deviceId: value})
        }
      })}
    </div`
  }
  return html`

    ${Modal({
      show: showElement,
      header: "Add Broadcast",
      contents: html`<div id="add broadcast" class="pa3 f6 fw3">
            ${radioSelect(
              {
                label: "kind:",
                options:  [
                  { name: "kind",
                    checked: bState.kind==="audio"? "true": "false",
                    value: "audio" },
                  { name: "kind",
                      checked: bState.kind==="audio"? "false": "true",
                      value: "video" }
                ],
                onChange: setBroadcastKind
              }
            )}

            ${constraintOptions}
        </div>`,
      close: () => (emit('user:modalAddBroadcast', false))
    })}
    `

    function setBroadcastKind(e){
      emit('devices:setBroadcastKind', e.target.value)
    }

    function updateBroadcastConstraints(updateObject){
      emit('devices:updateBroadcastConstraints', updateObject)
    }


}
