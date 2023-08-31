module.exports = [
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
            role: 'toggleDevTools'
          }
        ]
      },
      {
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
      }
]