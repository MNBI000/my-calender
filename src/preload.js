// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer, net } = require('electron')

contextBridge.exposeInMainWorld('testBridge', {
  calendarApi: async () => {
    var result = await ipcRenderer.invoke('calendarApi')
  },
  dataApi: async () => {
    var result = await ipcRenderer.invoke('calendarApi')
  }
})
console.log(net)
ipcRenderer.on('apiData', (event, json) => {
  const allEvents = JSON.parse(json);
  // const eventsArray = Object.values(events);
  console.log(allEvents);
  console.log(event);
})

var calendarObj = {
  initialView: 'dayGridMonth',
  headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear,listWeek'
  },
  themeSystem: 'bootstrap5',
  nowIndicator: true,
  businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday

      startTime: '9:00', // a start time (10am in this example)
      endTime: '17:00', // an end time (6pm in this example)
  },
  
  // events: global.myGlobalEvents, // events from the API
  events: [{
    id: "1",
    title  : 'eventDaily',
    // start  : '2023-08-19',
    // startTime: '12:30:00',
    // startRecur:'2023-08-19',
    // endRecur:'2023-08-29',
    // endTime: '14:30:00',
    // allDay : false, // will make the time show
    // color: 'yellow',
    // textColor: 'red'
    description: "hello",
    done: false,
    rrule: {
            freq: 'daily',
            interval: 1,
            // byweekday: [ 0,1,2,3,4 ],
            dtstart: '2023-08-24', // will also accept '20120201T103000'
            until: '2023-09-24' // will also accept '20120201'
        },
},
{
  id: 1,
  title: "first event",
  description: "this is first event in my database",
  color: "#f50",
  done: 0,
  rrule: {
    freq: "daily",
    interval: 1,
    dtstart: "2023-08-30",
    until: "2023-09-30"
  }
}
], // events from the API
          
  eventDataTransform: function (myEvent) {
    var expiredColor = '#ff0000'; // Set the color for expired events
    var doneColor = '#37d88f'; // Set the color for expired events
    
    var eventColor = myEvent.rrule.dtstart < new Date() ? "" : expiredColor;
    if (myEvent.done == true) {
      var color = doneColor;
    }
        // var color = assignColorBasedOnTitle(myEvent.summary);
        return {
          id: myEvent.id,
          title: myEvent.title,
          description: myEvent.description,
          color: color,
          // backgroundColor: eventColor,
          done: myEvent.done,
          rrule: {
              freq: myEvent.rrule.freq,
              interval: myEvent.rrule.interval,
              // byweekday: [ 0,1,2,3,4 ],
              dtstart: myEvent.rrule.dtstart,
              until: myEvent.rrule.until,
          },
        };


  },
  dateClick: function(info) {
  alert('a day has been clicked!\n'+ info.dateStr);
  },
  eventClick: function(event) {
      // console.log(event.id);
      confirm(`${(event.event._def.extendedProps.description != undefined) ? event.event._def.extendedProps.description : "There is no description."}`);
      if (confirm) {
        console.log('yes');
      } else {
        console.log('no');
      }
      // document.querySelector('dialog p').insertAdjacentHTML('beforeend', `${(event.event._def.extendedProps.description != undefined) ? event.event._def.extendedProps.description : "There is no description."}`);
      // document.querySelector('dialog').style.display = 'block';
      // document.getElementById('done').setAttribute('date-event', event.id)
      // document.getElementById('ok').setAttribute('date-event', event.id)

  }
};
contextBridge.exposeInMainWorld('calendarObj', calendarObj)