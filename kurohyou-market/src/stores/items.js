import * as fuzzysort from 'fuzzysort';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { objectifySheet } from './helpers/objectifySheet';
import { generateStore } from './helpers/inventory';
import { gapiInit } from '@/assets/js/gapiInit';
import * as calc from '@/assets/js/calculators';

const headerIndexes = {
  'Item':-1,
  'GP':-1,
  'Rarity':-1,
  'Source':-1,
  'Page':-1,
  'Type':-1,
  'Attunement':-1,
  'Search DC':-1
};

export const useItemStore = defineStore('item', ()=>{
  let loading = ref(true);

  const items = ref([]);
  let filterItems = ref([]);
  const displayItems = ref([]);

  const campaigns = ref([]);
  let campaign = ref(null);

  const locations = ref([]);
  let location = ref(null);
  let filterLocations = ref([]);

  let searchString = ref('');
  let attuneSearch = ref('');
  const rareSearch = ref([]);
  const typeSearch = ref([]);
  const locationSearch = ref('');

  const shops = ref([]);
  const activeShopID = ref(null);
  const localShops = ref([]);
  const inventories = ref({});
  
  const runFilterItems = function(){
    console.log('filtering items');
    filterItems.value = fuzzysort.go(searchString.value,items.value,{all:true,keys:['Item','GP','Source']})
      .reduce((memo,item) => {
        const attuneMatch = attuneSearch.value ?
          item.obj.Attunement === attuneSearch.value :
          true;
        const rarityMatch = rareSearch.value.length ?
          rareSearch.value.indexOf(item.obj.Rarity) >= 0 :
          true;
        const typeMatch = typeSearch.value.length ?
          typeSearch.value.some(t => item.obj.Type.includes(t)) :
          true;
        if(attuneMatch && rarityMatch && typeMatch){
          memo.push({
            ...item.obj,
            realDC: calc.searchDC(location.value || locations.value[0],item.obj['Search DC'],item.obj.Rarity),
            realCost: calc.realCost(location.value || locations.value[0],item.obj.GP)
          });
        }
        return memo;
      },[]);
  };

  const runFilterLocations = function(){
    const filtered = fuzzysort
    .go(locationSearch.value,locations.value,{key:'Name'})
    .map(res => res.obj);
    filterLocations.value = filtered;
  };

  const runFilterShops = function(){
    localShops.value = shops.value.filter(shop => {
      return shop.parent_id === location?.value.id
    });
  };

  const refreshActiveInventory = () => {
    const shopName = shops.value[activeShopID.value]?.Name;
    if(!shopName) return;
    inventories.value[shopName] = generateStore();
  }

  const runInventoryCheck = () => {
    const shopName = shops.value[activeShopID.value]?.Name;
    
    if(!loading.value && shopName && !inventories.value[shopName]?.length){
      refreshActiveInventory();
    }
  };

  const activeInventory = computed(()=>{
    const thisShop = shops.value[activeShopID.value];
    if(!thisShop) return [];
    const inventoryNames = inventories.value[thisShop.Name];
    const fullInventory = items.value.filter(item => 
      inventoryNames?.indexOf(item.Item) > -1);
    return fullInventory.map(item => {
      return {
        ...item,
        realCost: calc.realCost(thisShop,item.GP)
      }
    });
  });

  watch(
    [shops,activeShopID],
    runInventoryCheck
  );

  watch(
    locationSearch,
    runFilterLocations
  );
  
  watch(
    location,
    runFilterShops
  );

  async function init(){
    let response;
    try {
      await gapiInit();
      response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: '14LkK1PrfkjeTsqpHypRrRKctvIM4DZ1Dag939D8wKig',
        ranges:[
          'Full',
          'Campaigns',
          'Locations',
          'Stores'
        ]
      });
    } catch (err) {
      console.error(err);
      return;
    }
    const [priceSheet,campaignSheet,locationSheet,storeSheet] = response.result.valueRanges;
    // Populate campaign data
    const campArr = [];
    objectifySheet({
      headers:campaignSheet.values.shift().map((v,i) => [v,i]),
      values:campaignSheet.values,
      target:campArr
    });
    
    
    // populate item data
    const sheetHeaders = priceSheet.values.shift();
    Object.keys(headerIndexes).forEach(h => headerIndexes[h] = sheetHeaders.indexOf(h));
    const itemArr = [];
    objectifySheet({
      headers:Object.entries(headerIndexes),
      values:priceSheet.values,
      target:itemArr
    });

    // Populate location data
    locationSheet.values.shift();
    const locationArr = [];
    objectifySheet({
      headers:locationSheet.values.shift().map((v,i) => [v,i]),
      values:locationSheet.values,
      target:locationArr
    });

    // Populate shop data
    const shopArr = [];
    objectifySheet({
      headers:storeSheet.values.shift().map((v,i) => [v,i]),
      values:storeSheet.values,
      target:shopArr
    });
    const activeCamp = this.campaign ||
      campArr[0];
    const activeLoc = this.location ||
      locationArr.find(o => o.Name === activeCamp['Current Location']);
    console.log('stored inventories',this.inventories);
    
    this.$patch({
      // inventories: this.inventories || {},
      campaigns:campArr,
      locations:locationArr,
      shops:shopArr,
      items:itemArr,
      campaign: activeCamp,
      location: activeLoc
    });

    runFilterItems();
    runFilterShops();
    this.loading = false;
  }

  return {loading,items,displayItems,campaigns,locations,shops,searchString,attuneSearch,rareSearch,typeSearch,location,campaign,locationSearch,init,filterItems,filterLocations,localShops,inventories,activeShopID,activeInventory,refreshActiveInventory};
},
{
  // Store options
  persist:{
    paths:['location','campaign','inventories']
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useItemStore, import.meta.hot))
}