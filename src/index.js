const { app, BrowserWindow, Menu, MenuItem } = require('electron');
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

  Menu.setApplicationMenu(menu)

  // app.whenReady().then(createWindow)

  // app.on('window-all-closed', () => {
  //   if (process.platform !== 'darwin') {
  //     app.quit()
  //   }
  // })
  
  // app.on('activate', () => {
  //   if (BrowserWindow.getAllWindows().length === 0) {
  //     createWindow()
  //   }
  // })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  sound.play("sounds/error.mp3");
  

//   const { Calendar } = require('@fullcalendar/core');
// require('@fullcalendar/daygrid');
//   const calendarEl = mainWindow.webContents.executeJavaScript('document.getElementById("calendar")');
//   console.log(calendarEl);
//   mainWindow.webContents.on('did-finish-load', () => {
//     const calendar = new Calendar(calendarEl, {
//       plugins: [ 'dayGrid' ],
//       initialView: 'dayGridMonth'
//       // Other FullCalendar options...
//     });
  
//     calendar.render();
//   });
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

