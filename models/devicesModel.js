const enumerateDevices = require('enumerate-devices')

const xtend = Object.assign

const isFirefox = typeof InstallTrigger !== 'undefined'
const isChrome = !!window.chrome && !!window.chrome.webstore

module.exports = devicesModel

function devicesModel (state, bus) {
// object representing the user's input and output devices
  state.devices = xtend({
    videoinput: {
      byId: {},
      all: []
    },
    audiooutput: {
      byId: {},
      all: []
    },
    audioinput: {
      byId: {},
      all: []
    },
    videooutput: {
      byId: {},
      all: []
    },
    default: {
      audioinput: null,
      videoinput: null
    },
    popupwindows: {}
  }, state.devices)

// TO DO: put this function somewhere else
  window.onload = function () {
    getDevices()
    bus.emit('peers:updatePeer', {
      peerId: state.user.uuid
    })
  }

  bus.on('devices:getDevices', getDevices)

  bus.on('devices:setDefaultAudio', function (val) {
    setDefaultAudio(val)
  })

  bus.on('devices:setDefaultVideo', function (val) {
    setDefaultVideo(val)
  })

  bus.on('devices:popupWindow', function(val) {
    popupWindow(val)
  })

  bus.on('devices:audioLevel', function(val) {
    audioLevel(val)
  })

  bus.on('devices:fullscreenWindow', function(val) {
    fullscreenWindow(val)
  })
// bus.on('devices:getDevices', function () {
// TO DO: use electron remote available displays to enumerate video output devices
// })

  function setDefaultAudio (val) {
    if (state.devices.default.audioinput !== val) {
      state.devices.default.audioinput = val
      bus.emit('media:addLocalMedia', {
        constraints: {
          audio: { deviceId: { exact: state.devices.default.audioinput } },
          video: false
        },
        isDefault: true
      })
    }
    bus.emit('render')
  }

  function setDefaultVideo (vid) {
    if (state.devices.default.videoinput !== vid) {
      console.log('SETTING VIDEO', vid)
      state.devices.default.videoinput = vid
      bus.emit('media:addLocalMedia', {
        constraints: {
          audio: false,
          video: { deviceId: { exact: state.devices.default.videoinput } }
        },
        isDefault: true
      })
    }
  }

  function getDevices () {
    enumerateDevices().then((devices) => {
      const kinds = ['audioinput', 'videoinput', 'audiooutput']

      kinds.forEach((kind) => {
        const filtered = devices.filter((elem) => elem.kind === kind)

        state.devices[kind].all = filtered.map((elem) => {
          state.devices[kind].byId[elem.deviceId] = xtend({}, elem)
          return elem.deviceId
        })
      })

  // Set default audio and video devices
      if (state.devices.audioinput.all.length > 0) setDefaultAudio(state.devices.audioinput.all[0])
      if (state.devices.videoinput.all.length > 0) setDefaultVideo(state.devices.videoinput.all[0])

      console.log('DEVICES', state.devices)
      bus.emit('render')
    }).catch(console.log.bind(console)) // TO DO:: display error to user
  }

  function popupWindow(vidID) {
    console.log('vidID', vidID)
    var vidEl = document.getElementById(vidID)
    var ip = window.location.host
    var popupWindow = window.open("https://" + ip + "/show.html", 'Win_' + vidID, 'popup')
    state.devices.popupwindows[vidID] = popupWindow
    console.log('popupWindows', state.devices.popupwindows)
    popupWindow.onload = function(){
      popupWindow.document.getElementById('showVideo').srcObject = vidEl.srcObject
    }
  }

  function fullscreenWindow(el) {
    var popupWindow = state.devices.popupwindows[el.name]
    console.log('el', el)
    popupWindow.focus()
    if (el.value == 'Full Screen') {
        if (isFirefox == true) {
            popupWindow.document.getElementById('showVideo').mozRequestFullScreen();
        }
        if (isChrome == true) {
            popupWindow.document.getElementById('showVideo').webkitRequestFullScreen();
        }
        el.value = 'Exit Full'
    } else {
        if (isFirefox == true) {
            popupWindow.document.getElementById('showVideo').mozCancelFullscreen();
        }
        if (isChrome == true) {
            popupWindow.document.getElementById('showVideo').webkitExitFullscreen();
        }
        el.value = 'Full Screen'
    }
  }

  function audioLevel(el) {
    var audioEl = document.getElementById(el.name)
    audioEl.volume = el.value
    audioEl.muted = false
  }

}
