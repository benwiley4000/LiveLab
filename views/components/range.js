'use strict'

const html = require('choo/html')
const xtend = require('xtend')

module.exports = rangeElement

// reusable input element
function rangeElement (name, defaultText, opts) {
  if (!opts) opts = {}

  var defaultProps = {
    type: 'range',
    name: name,
    placeholder: defaultText
  }

  var rangeProps = xtend(defaultProps, opts)

  if (!rangeProps.class) {
    var defaultClass = 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-100'
    rangeProps.class = defaultClass
  }

  var divClass = "mv3"
  if (rangeProps.divclass) {divClass = rangeProps.divclass}

  return html`<div class=${divClass}>
    <label class="db fw6 lh-copy f6" for=${name}>${name}</label>
    <input ${rangeProps}></input>
  </div>`
}
