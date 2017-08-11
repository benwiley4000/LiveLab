'use strict'

const expose = require('choo-expose')
const log = require('choo-log')
const choo = require('choo')

const app = choo()

app.use(log())
app.use(expose())
// }

app.use(require('./models/devicesModel.js'))
app.use(require('./models/mediaModel.js'))
app.use(require('./models/peersModel.js'))
app.use(require('./models/userModel.js'))

app.route('/index.html', require('./views/main.js'))

app.use(function (state) {
	console.log('state', state)
})

app.mount('div')