'use strict'

const html = require('choo/html')
const xtend = require('xtend')

module.exports = buttonElement

// reusable input element
function buttonElement (name, defaultText, opts) {
  if (!opts) opts = {}

  var defaultProps = {
    type: 'button',
    name: name,
    placeholder: defaultText
  }

  var buttonProps = xtend(defaultProps, opts)

  if (!buttonProps.class) {
    var defaultClass = 'pa2 input-reset ba bg-dark-gray hover-bg-black near-white w-100'
    buttonProps.class = defaultClass
  }

  var divClass = "mv3"
  if (buttonProps.divclass) {divClass = buttonProps.divclass}

  return html`<div class=${divClass}>
    <label class="db fw6 lh-copy f6" for=${name}>${name}</label>
    <input ${buttonProps}>
  </div>`
}
