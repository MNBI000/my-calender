const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain, net, ipcRenderer } = require('electron');
const path = require('path');
const sound = require("sound-play");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: "./assets/img/logo.jpg",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'Main',
    submenu: [
      {
        label: 'Main Calendar',
        role: 'Main Calendar',
        accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
        click: () => {
          mainWindow.loadFile(path.join(__dirname, 'index.html'));
        }
      },
      {
        label: 'reopen app',
        role: 'reopen app',
        accelerator: process.platform === 'darwin' ? 'Cmd+W' : 'Ctrl+W',
        click: () => {
          app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
          app.exit(0)
        }
      }
    ]
  }))
  menu.append(new MenuItem({
    label: 'Tools',
    submenu: [
      {
        label: 'Dev Tools',
        role: 'Dev Tools',
        accelerator: process.platform === 'darwin' ? 'Cmd+J' : 'Shift+Ctrl+J',
        click: () => {
          mainWindow.webContents.openDevTools();
        }
      }
    ]
  }))
  menu.append(new MenuItem({
    label: 'Dashboard',
    submenu: [
      {
        label: 'Add Event',
        role: 'Add Event',
        click: () => {
          mainWindow.loadFile(path.join(__dirname, 'dashboard/addEvent.html'));
        }
      }
    ]
  }))

  Menu.setApplicationMenu(menu)

  // Open the DevTools.
  let wc = mainWindow.webContents;

  wc.on('dom-ready', (e) => {
    // console.log(path.join(__dirname, 'preload.js'))
    // sound.play(path.join(__dirname, "assets/sounds/alarm.wav"));
    // dialog.showMessageBox(
    //   (options = {
    //     message: "hello message body is set on open the app",
    //     title: "start message"
    //   })).then((res) => {
    //     console.log(res);
    //   });
      
  })
  ipcMain.handle('calendarApi', async () => {
    const request = net.request({
      method: "POST",
      url: "https://api.texasapostille.org/public/api/getstatenames"
    });
    request.on('response', (response) => {
      const data = [];
      response.on('data', (chunk) => {
        data.push(chunk);
      })
      response.on("end", () => {
        const json = Buffer.concat(data).toString();
        console.log(json);
        mainWindow.webContents.send('apiData', json);
      })
    });
    request.end();
  })

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
