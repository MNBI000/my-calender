// Modules
const {app, BrowserWindow, session, globalShortcut, Menu, Tray} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

function createTray() {
  tray = new Tray('./assets/img/iconTemplate@2x.png');
  tray.setToolTip('My Calrendar App is working')
  
  tray.on('click', e => {
    mainWindow.isVisible() ? mainWindow.hide()  :mainWindow.show()
  })

  let trayMenu = Menu.buildFromTemplate(require('./menus/trayMenu'))
  tray.setContextMenu(trayMenu)
}

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  
  createTray()
  
  let customSession = session.fromPartition('persist:part1')
  
  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    minHeight: 800,
    minWidth: 800,
    center: true,
    // alwaysOnTop: true,
    hasShadow: true,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
      session: customSession,
    },
    icon: "./assets/img/icon.png",
    show: false,
  })
  
  
  let mainMenu = Menu.buildFromTemplate([
    {
        label: 'Main',
        submenu: [
          {
            label: 'Main Calendar',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
            click: () => {
              mainWindow.loadFile(path.join(__dirname, 'index.html'));
            }
          },
          {
            label: 'reopen app',
            accelerator: process.platform === 'darwin' ? 'Cmd+W' : 'Ctrl+W',
            click: () => {
              app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
              app.exit(0)
            }
          }
        ]
      },
      {
        label: 'Tools',
        submenu: [
          {
            label: 'Dev Tools',
          }
        ]
      },
      {
        label: 'Dashboard',
        submenu: [
          {
            label: 'Add Event',
            click: () => {
              mainWindow.loadFile(path.join(__dirname, 'dashboard/addEvent.html'));
            }
          },
          {
            label: 'All Evenets',
            click: () => {
              mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'dashboard/allEvents.html'),
                protocol: 'file:',
                slashes: true
              }));
              // mainWindow.loadFile(path.join(__dirname, ''));
            }
          }
        ]
      }
])
  
  //set App Menu
  Menu.setApplicationMenu(mainMenu)


  let getCookies = () => {
    customSession.cookies.get({})
    .then(cookies => {
      console.log("cookies", cookies)
    })
    .catch(errors => {
      console.log(errors)
    })
  }
  mainWindow.loadFile('index.html')
  
  globalShortcut.register("F + M", () => {
    mainWindow.loadURL('https://usarab.com')
    console.log('M pressed');
  })
  globalShortcut.unregister('F + M')
  // Load index.html into the new BrowserWindow
  
  mainWindow.webContents.openDevTools()


  mainWindow.once('ready-to-show', mainWindow.show)

  customSession.on('will-download', (e, downloadItem, webContents) => {
    console.log('download item: ')
    console.log(downloadItem.getFilename())
    console.log(downloadItem.getTotalBytes())
  })
  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
