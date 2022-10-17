// 
// Adapted from Google API quickstart https://developers.google.com/sheets/api/quickstart/js
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = 'torrigoyd-magic';
const API_KEY = 'AIzaSyB19ki9vCjLEKwttOnvdZnITSQfNZu0enY';
let spreadsheets;
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
let gapiInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  console.log('Gapi initiated');
  spreadsheets = gapi.client.sheets.spreadsheets;
  gapiInited = true;
}