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
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
export async function gapiInit() {
  console.log('waiting on gapiPromise');
  console.log('initializing gapi');
  await gapiPromise;
  await new Promise((res,rej) => gapi.load('client',{callback:res,onerror:rej}));
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  console.log('gapi initialized');
}