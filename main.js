// Modules
const {app, BrowserWindow, session, globalShortcut, Menu, Tray, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const updater = require('./updater')
// const { app, BrowserWindow, ipcMain } = require('electron');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  '472995507032-tcui1pauebvm305hb30rfj6lnap83ojh.apps.googleusercontent.com',
  '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',
  'http://localhost' // Make sure this matches the redirect URI in your Google Cloud Console project.
);

// Open a browser window to the OAuth2 URL
ipcMain.on('open-auth-window', (event) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar', // Your desired scope(s)
  });

  const authWindow = new BrowserWindow({ width: 800, height: 600 });

  authWindow.loadURL(authUrl);

  // Handle the callback when the user grants permission
  authWindow.webContents.on('will-redirect', async (event, url) => {
    const query = new URL(url).searchParams;
    const code = query.get('code');

    if (code) {
      // Exchange the authorization code for access tokens
      const { tokens } = await oauth2Client.getToken(code);
      // Store or use the tokens as needed
      mainWindow.webContents.send('tokens-received', tokens);
      authWindow.close();
      console.log(tokens);
    }
  });
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

function createTray() {
  tray = new Tray(__dirname+'\\assets\\img\\iconTemplate@2x.png');
  tray.setToolTip('My Calrendar App is working')
  
  tray.on('click', e => {
    mainWindow.isVisible() ? mainWindow.hide()  :mainWindow.show()
  })

  let trayMenu = Menu.buildFromTemplate(require('./menus/trayMenu'))
  tray.setContextMenu(trayMenu)
}

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  setTimeout(updater, 3000)
  
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
    icon: __dirname+"\\assets\\img\\icon.png",
    show: false,
  })
  
  
  let mainMenu = Menu.buildFromTemplate([
    {
      label: 'Home',
      accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
      click: () => {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
      }
    },
    {
      label: 'Events with Google',
      accelerator: process.platform === 'darwin' ? 'Cmd+G' : 'Ctrl+G',
      click: () => {
        mainWindow.loadFile(path.join(__dirname, 'indexGoogle.html'));
      }
    },
    {
      label: 'Settings',
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
      console.log("cookies test", cookies)
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
