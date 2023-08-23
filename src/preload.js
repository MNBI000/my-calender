// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('testBridge', {
  calendarApi: async () => {
    var result = await ipcRenderer.invoke('calendarApi').then((result) => {
      
    })
  }
})

ipcRenderer.on('apiData', (event, json) => {
  const stateNames = [];
  const states = JSON.parse(json).states;
  const statesArray = Object.values(states);
  statesArray.forEach(state => {
    stateNames.push(state.name);
  });
  // JSON.parse(json).states.map((state) => {
    // stateNames.push(state.name);
  // })
  console.log(stateNames);
})