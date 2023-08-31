const fetch = require("node-fetch"),
  dialogElement = document.querySelector("dialog"),
  path = require("path");

const apiData = async () => {
  const getAllEvents = await fetch(
    "http://localhost/calendar-api/public/api/fetch-events-dashboard",
    { method: "POST", body: "" }
  );
  const allEvents = await getAllEvents.json()
  function htmlCellRenderer(params) {
    const cellValue = params.value;
    const cellElement = document.createElement("div");
    cellElement.innerHTML = cellValue;
    return cellElement;
  }
  const allKeys = Object.keys(allEvents.events[0])
  const columnDefs = allKeys.map(item => ({ field: item, cellRenderer: htmlCellRenderer }))
  // specify the data
  const outputArray = allEvents.events;
  const rowData = outputArray;
  console.log(columnDefs);
  console.log(rowData);
  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {sortable: true, filter: true},
      rowSelection: 'single', // 'single', 'multiple', or 'none'
      rowHeight: 50,
      pagination: true,
      paginationPageSize: 10,
      animateRows: true,
      enableCellTextSelection: true,
      domLayout: 'autoHeight', // or 'normal'
  };

  // setup the grid after the page has finished loading
    setTimeout(() => {
      const gridDiv = document.querySelector("#myGrid");
      console.log(gridDiv)
      new agGrid.Grid(gridDiv, gridOptions);
    }, 1000);
  
};

apiData();
