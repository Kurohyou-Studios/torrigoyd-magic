const storedData = new Proxy(
  JSON.parse(localStorage.getItem('torrigoyd')) || {},
  {
    set(target, prop, value){
      target[prop] = value;
      localStorage.setItem('torrigoyd',JSON.stringify(target));
    }
  });

const headerIndexes = {
  'Item':-1,
  'GP':-1,
  'Rarity':-1,
  'Source':-1,
  'Page':-1,
  'Type':-1,
  'Attunement':-1,
  'Search DC':-1
}
  
const $campaignSelect = document.getElementById('campaign-name');
const $locationSearch = document.getElementById('location-search');
const $campaignHeader = document.getElementById('active-campaign');
const $locationHeader = document.getElementById('current-location');
const $locationSuggestions = document.getElementById('location-suggestions');

const citySizes = {
  Metropolis:-40,
  'Large City':-20,
  'Small City':0,
  Town:20,
  Village:40
};

const rarityDCs = {
  Common:[1,40],
  Uncommon:[41,80],
  Rare:[81,120],
  'Very Rare':[121,160],
  Legendary:[161,200]
};

const itemHeaders = Object.keys(headerIndexes);
const itemContent = [];

const campaigns = [];
let activeCampaign;
const locations = [];
let activeLocation;