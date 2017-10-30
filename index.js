const { app } = require('electron')
app.commandLine.appendSwitch("ignore-certificate-errors")
const path = require('path')
const window = require('electron-window')
const { ipcMain } = require('electron')

app.on('ready', () => {
  const mainWindow = window.createWindow({ width: 1000, height: 800 })
  const indexPath = path.join(__dirname, 'index.html')
  mainWindow.showUrl(indexPath, () => {
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  })
  ipcMain.on('oscSend', (event, msg) => {
    mainWindow.webContents.send('oscSend', msg)
  })
  ipcMain.on('oscShare', (event, msg) => {
    mainWindow.webContents.send('oscShare', msg)
  })
  // open dev tools by default in dev mode
})