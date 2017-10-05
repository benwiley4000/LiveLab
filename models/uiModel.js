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
  }
  }, state.ui)

  bus.on('ui:updateInspectorTrack', function (opts) {

      state.ui.inspector = xtend(state.ui.inspector, opts)
      console.log("PEER CONNECTION", state.ui.inspector)
      bus.emit('render')
  })

  bus.on('ui:closeInspector', function () {
    state.ui.inspector.trackId = null
    state.ui.inspector.pc = null
    bus.emit('render')
  })

}
