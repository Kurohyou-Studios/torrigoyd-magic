const storedData = new Proxy(
  JSON.parse(localStorage.getItem('torrigoyd')) || {shops:{}},
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

// HTML Elements
const $main = document.getElementById('main-page');
const $breadcrumb = document.getElementById('location-breadcrumb');
const $campaignSelect = document.getElementById('campaign-name');
const $locationSearch = document.getElementById('location-search');
const $campaignHeader = document.getElementById('active-campaign');
const $locationSuggestions = document.getElementById('location-suggestions');

// Item Search Elements
let $searchInput;
let $attuneFilter;
let $rareFilter;
let $typeFilter;
let $searchForm;
let $resultTarget;

// Shop Search Elements
let $shopContainer

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

const shops = [];
let activeShop;