const { app, BrowserWindow } = require('electron')
require('electron-reload')(__dirname);
const url = require("url");
const path = require("path");

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    title:"Video Editor v1"
  })
  win.setMenuBarVisibility(false)


  // and load the index.html of the app.
//  win.loadURL(`file://${__dirname}/dist/video-editor-angular/index.html`)
win.loadURL("http://localhost:4200/")
  //win.webContents.openDevTools()
}


app.on('ready', createWindow)
