'use strict'

const html = require('choo/html')
const xtend = require('xtend')

module.exports = inputElement

// reusable input element
function inputElement (name, defaultText, opts) {
  if (!opts) opts = {}

  var defaultProps = {
    type: 'text',
    name: name,
    placeholder: defaultText
  }

  var inputProps = xtend(defaultProps, opts)

  if (!inputProps.class) {
    var defaultClass = 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-100'
    inputProps.class = defaultClass
  }

  var divClass = "mv3"
  if (inputProps.divclass) {divClass = inputProps.divclass}  

  return html`<div class=${divClass}>
    <label class="db fw6 lh-copy f6" for=${name}>${name}</label>
    <input ${inputProps}>
  </div>`
}
