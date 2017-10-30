// State information specifically related to the ui
// to do: unify ui information in this model

var xtend = Object.assign

module.exports = uiModel

function uiModel (state, bus) {
  state.ui = xtend({
  communication: [], // to do: this should store information specifically about the
  inspector: {
    trackId: null,
    pc: null, //peer connection to be inspected
    selectedTab: "track" //which inspector tab is currently open
  },
  chat: {
    messages: [

    ],
    current: ""
  },
  localOSC: [
    "",
    ""
  ],
  remoteOSC: {
    peer: "",
    osc: [
      "",
      ""
    ]
  }
  }, state.ui)

  bus.on('ui:updateInspectorTrack', function (opts) {

      state.ui.inspector = xtend(state.ui.inspector, opts)
      console.log("PEER CONNECTION", state.ui.inspector)
      bus.emit('render')
  })

  bus.on('ui:sendChatMessage', function(){
    var chatObj = {
      peerId: state.user.uuid,
      message: state.ui.chat.current,
      date: Date.now()
    }
    bus.emit('user:sendChatMessage', chatObj)
    appendNewChat(chatObj)
    state.ui.chat.current = ""
    bus.emit('render')

  })

  bus.on('ui:receivedNewChat', function (chatObj){
    appendNewChat(chatObj)
    bus.emit('render')
  })

  bus.on('ui:updateChat', function(text){
    state.ui.chat.current = text
  })

  // bus.on('ui:createLocalOSC', function(OSCInfo){
  //   var OSCObj = {
  //     source: {
  //       address: OSCInfo.ipAddy,
  //       port: OSCInfo.port
  //     },
  //     OSCaddress: OSCInfo.oscAddy,
  //     value: 0,
  //     active: true
  //   }
  //   state.ui.localOSC.push(OSCObj)
  //   bus.emit('render')
  // })

  bus.on('ui:receivedOSC', function (OSCObj){
    updateRemoteOSC(OSCObj)
    bus.emit('render')
  })

  if (isElectron()) {
    ipcRenderer.on('oscSend', (event, msg) => {
      updateLocalOSC(msg)
      bus.emit('render')
    })
  }

  // bus.on('ui:localOSC', function (OSCObj){
  //   updateLocalOSC(OSCObj)
  //   bus.emit('render')
  // })

  bus.on('ui:closeInspector', function () {
    state.ui.inspector.trackId = null
    state.ui.inspector.pc = null
    bus.emit('render')
  })

  function appendNewChat(chatObj){
    if(state.peers.byId[chatObj.peerId]){
      chatObj.nickname = state.peers.byId[chatObj.peerId].nickname
      state.ui.chat.messages.push(chatObj)
    } else {
      console.log("USER NOT FOUND", chatObj)
    }

  }

  function updateRemoteOSC(oscObj){
    state.ui.remoteOSC.peer = state.peers.byId[oscObj.peerId].nickname
    state.ui.remoteOSC.osc = oscObj.osc
    console.log('oscObj.osc', oscObj.osc)
    // var newOSC = true
    // state.ui.remoteOSC.forEach( function(obj) {
    //   if (obj.peer == OSCObj.peer && obj.OSCaddress == OSCObj.OSCaddress) {
    //     obj = OSCObj
    //     newOSC = false
    //   }
    // })
    // if (newOSC) {
    //   state.ui.remoteOSC.push(OSCObj)
    // }
  }

  function updateLocalOSC(msg) {
    state.ui.localOSC = msg
  }

}