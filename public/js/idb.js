// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called "budget_tracker"
// and set it to version 1
// note that indexedDB is part of the browser's 'window' object and is a global
// variable. The .open() method takes two parameters: the name of the IndexedDB
// database we'd like to connect to (or create if nonexistent) and the version of
// the database
const request = indexedDB.open("budget_tracker", 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
// the onupgradeneeded will emit the first time the code is run and create the 'new_budget_record'
// object store. It won't run again until we delete the database from the browser or we change
// the version number in the .open() method
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called `new_budget_record`, set it to have an auto incrementing primary key of sorts
  // the .createObjectStore will create an object store that will hold all the data
  // associated with our budget tracking. We tell it to have autoIncrement index for each
  // new set of data we insert.
  db.createObjectStore("new_budget_record", { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;
  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    // uploadPizza();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};


// This function will be executed if we attempt to submit a transaction and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_budget_record"], "readwrite");

  // access the object store for `new_budget_record`
  const budgetObjectStore = transaction.objectStore("new_budget_record");

  // add record to your store with add method
  budgetObjectStore.add(record);
}
