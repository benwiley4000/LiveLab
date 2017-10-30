'use strict'

const html = require('choo/html')

module.exports = slider


function slider(opts){
  return html`<div  class="mv3">
    <span class="dib w4"> ${opts.label} : ${opts.value} </span>
    <input class="ml3 mr2" type="range" step=${opts.step} min=${opts.min} max=${opts.max} value=${opts.value} oninput=${opts.onChange} name=${opts.label}></input>

  </div>`
}
