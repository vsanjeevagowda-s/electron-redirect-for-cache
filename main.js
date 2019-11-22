// Modules to control application life and create native browser window
const {app, BrowserWindow, session} = require('electron')
const path = require('path')
const url  = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// console.log({ protocol });

function createWindow () {
  // Create the browser window.
// const content = new Buffer("you've been conned!");
//   protocol.interceptBufferProtocol("http", (request, result) => {
//     const url = request.url
//     console.log('const url = request.url', url)
//     console.log({ request })
//     console.log()
//     console.log({ result })
//     // if (request.url === "http://www.google.com")
//     return result(request);
//   });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const filter = {
    urls: ['<all_urls>']
  }

  const requestCallback = (details, callback) => {
    console.log({ url: details.url });
    // console.log({ url })
    const hostPath = url.parse(details.url).host;
    // if (hostPath === "localhost:9008" || hostPath === "localhost:3000" || hostPath === "wpad" || hostPath === "devtools") {
    //   callback({ cancel: false, requestHeaders: details.requestHeaders })
    // } else {
    //   callback({ cancel: false, redirectURL: `http://localhost:9008/?url=${details.url}`, requestHeaders: details.requestHeaders })
    // }

    const extent = path.extname(details.url)
    if(extent === '.png' && hostPath !== "localhost:9008"){
      callback({ cancel: false, redirectURL: `http://localhost:9008/?url=${details.url}`, requestHeaders: details.requestHeaders })
    }else{
      callback({ cancel: false })
    }
  }

  mainWindow.webContents.session.webRequest.onBeforeRequest(filter, requestCallback )

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
