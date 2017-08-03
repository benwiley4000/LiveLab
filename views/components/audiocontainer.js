'use strict'

const html = require('choo/html')
const xtend = require('xtend')
var Nano = require('nanocomponent')

module.exports = AudioContainer

// Video container component that accepts a mediaStreamTrack as well as display parameters
function AudioContainer () {
  if (!(this instanceof AudioContainer)) return new AudioContainer()
  Nano.call(this)
}

AudioContainer.prototype = Object.create(Nano.prototype)

AudioContainer.prototype._render = function () {
  if (!this.element) {
    var defaultHtmlProps = {
      autoplay: 'autoplay',
      muted: 'muted'
    }
    var _htmlProps = xtend(defaultHtmlProps, this.props.htmlProps)
    this.element = html`<audio ${_htmlProps}></audio>`
  }

  if (this.props.track && this.props.track != null) {
    console.log("TRACK ", this.props)
    var tracks = []
    tracks.push(this.props.track.track)
    this._stream = new MediaStream(tracks) // stream must be initialized with tracks, even though documentation says otherwise
    this.element.srcObject = this._stream
  }

  return this.element
}

// call "render" if track property has changed
AudioContainer.prototype._update = function (props) {
  return this.props.track !== props.track
}
