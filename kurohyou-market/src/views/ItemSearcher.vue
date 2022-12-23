<script setup>
import { useRouter,useRoute } from 'vue-router';
import { computed } from 'vue';
import * as fuzzysort from 'fuzzysort';

import * as calc from '@/assets/js/calculators';

import Items from '@/components/Items.vue';
import { useItemStore } from '@/stores/items.js';

const router = useRouter();
const route = useRoute();
const itemStore = useItemStore();
const getChecks = (elements) => [...elements].map(el => el.checked ? el.value : '').filter(v => v);
const getElements = (form) => {
  const search = form.querySelector('#search-term');
  const attune = form.querySelector('#attune');
  const rare = form.querySelectorAll('[name="rare"]');
  const type = form.querySelectorAll('[name="type"]');
  return [search,attune,rare,type];
};

const submitSearch = (event) => {
  const form = event.target;
  const [ searchEl, attuneEl, rareEl, typeEl ] = getElements(form);
  const search = searchEl.value;
  const attune = attuneEl.value;
  const rare = getChecks(rareEl);
  const type = getChecks(typeEl);
  router.replace({
    path:'/',
    query:{search,attune,rare,type}
  });
};
const items = computed(()=>{
  const form = document.querySelector('#item-form');

  const rareQuery = Array.isArray(route.query.rare) ?
    route.query.rare :
    [route.query.rare].filter(r => r);
  const typeQuery = Array.isArray(route.query.type) ?
    route.query.type :
    [route.query.type].filter(r => r);
  console.log(rareQuery);
  if(form){
    const [ searchEl, attuneEl, rareEl, typeEl ] = getElements(form);
    console.log('rareEl',rareEl);
    searchEl.value = route.query.search || '';
    attuneEl.value = route.query.attune || '';
    rareQuery.forEach(v => {
      const activeEl = [...rareEl].find(el=>el.value===v);
      activeEl.checked = true;
    });
    typeQuery.forEach(v => {
      const activeEl = [...typeEl].find(el=>el.value===v);
      activeEl.checked = true;
    });
  }
  const fuzzyFilter = fuzzysort.go(route.query.search,itemStore.items,{all:true,keys:['Item','GP','Source']});
  console.log('fuzzyFilter',fuzzyFilter);
  console.log('route.query',route.query);
  const matched = fuzzyFilter
    .reduce((memo,item)=>{
        const attuneMatch = route.query.attune ?
          item.obj.Attunement === route.query.attune :
          true;
        const rarityMatch = rareQuery ?
          rareQuery.indexOf(item.obj.Rarity) >= 0 :
          true;
        const typeMatch = typeQuery ?
          typeQuery.some(t => item.obj.Type.includes(t)) :
          true;
        if(attuneMatch && rarityMatch && typeMatch){
          memo.push({
            ...item.obj,
            realDC: calc.searchDC(itemStore.location || itemStore.locations[0],item.obj['Search DC'],item.obj.Rarity),
            realCost: calc.realCost(itemStore.location || locations.value[0],item.obj.GP)
          });
        }
        return memo;
      },[]);
  console.log('matched',matched);
  return matched;
  // return itemStore.items;
});
</script>
<template>
  <div class="p-content">
    <form id="item-form" @submit.prevent="submitSearch" class="d-flex flex-column">
      <fieldset class="form-group" :disabled="itemStore.loading">
        <label for="search-term">Search For</label>
        <div class="input-group">
          <input class="form-control" type="text" id="search-term" placeholder="Magic Item Name, Cost, or Source" autocomplete="off">
          <div class="input-group-append">
            <button class="input-group-text material-icons bg-primary text-white">search</button>
          </div>
        </div>
      </fieldset>
      <fieldset class="form-row gap-5" :disabled="itemStore.loading">
        <div class="col">
          <label>Rarity</label>
          <div class="row align-items-center pseudo-select">
            <label class="pseudo-option" style="margin:0">
              <input type="checkbox" value="Common" name="rare"><span class="rarity Common">Common</span>
            </label>
            <label class="pseudo-option" style="margin:0">
              <input type="checkbox" value="Uncommon" name="rare"><span class="rarity Uncommon">Uncommon</span>
            </label>
            <label class="pseudo-option" style="margin:0">
              <input type="checkbox" value="Rare" name="rare"><span class="rarity Rare">Rare</span>
            </label>
            <label class="pseudo-option" style="margin:0">
              <input type="checkbox" value="Very Rare" name="rare"><span class="rarity Very Rare">Very Rare</span>
            </label>
            <label class="pseudo-option" style="margin:0">
              <input type="checkbox" value="Legendary" name="rare"><span class="rarity Legendary">Legendary</span>
            </label>
          </div>
        </div>
        <fieldset>
          <label for="attune">Attunement</label>
          <select class="form-control" id="attune">
            <option value="" selected="selected">Any</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </fieldset>
      </fieldset>
      <fieldset class="form-group col" :disabled="itemStore.loading">
        <label>Type</label>
        <div class="row align-items-center pseudo-select">
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Ammunition" name="type"><span>Ammunition</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Armor" name="type"><span>Armor</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Potions &amp; Oils" name="type"><span>Potions &amp; Oils</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Ring" name="type"><span>Ring</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Rod" name="type"><span>Rod</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Scroll" name="type"><span>Scroll</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Shield" name="type"><span>Shield</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Spell Gem" name="type"><span>Spell Gem</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Staff" name="type"><span>Staff</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Wand" name="type"><span>Wand</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Weapon" name="type"><span>Weapon</span>
          </label>
          <label class="pseudo-option" style="margin:0">
            <input type="checkbox" value="Wondrous Item" name="type"><span>Wondrous Item</span>
          </label>
        </div>
      </fieldset>
    </form>
    <Items :items="items" />
  </div>
</template>