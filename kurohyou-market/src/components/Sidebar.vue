<script setup>
import { useItemStore } from '@/stores/items';
import * as fuzzysort from 'fuzzysort';

import Select from '@/components/Select.vue';
import Button from '@/components/Button.vue';

const itemStore = useItemStore();
const campaignNames = (campaigns) => campaigns
  .map(campaign => {
    return {value:campaign.Name};
  });

// Event listeners
const changeCampaignName = (event) => {
  itemStore.$patch({
    campaign: itemStore.campaigns.find(o => o.Name === event.target.value)
  })
};
const locationChange = (event) => {
  itemStore.$patch({
    locationSearch: event.target.value
  });
};
const locationUpdate = (elem) => {
  itemStore.$patch({
    location: itemStore.locations.find(loc => loc.Name === elem.dataset.location),
    locationSearch: ''
  });
}
const locationClick = (event) => {
  locationUpdate(event.target);
}
const locationSubmit = (event) => {
  const buttonToSelect = event.target.querySelector('#location-suggestions button');
  if(buttonToSelect?.dataset?.location){
    locationUpdate(buttonToSelect);
  }
}
</script>
<template>
  <div class="sidebar">
    <div class="sidebar-menu">
      <div class="sidebar-content">
        <form @submit.prevent="locationSubmit" id="campaign-settings">
          <fieldset class="form-group">
            <label for="campaign-name">Campaign</label>
            <Select id="campaign-name" @change="changeCampaignName" :options="campaignNames(itemStore.campaigns)" :selection="itemStore.campaign" />
          </fieldset>
          <fieldset class="form-group">
            <label for="location">Location</label>
            <input class="form-control" type="text" id="location-search" autocomplete="off" @input="locationChange" :value="itemStore.locationSearch">
          </fieldset>
          <ul class="d-flex flex-column gap-5 py-10" id="location-suggestions">
            <li v-for="location in itemStore.filterLocations" :key="location.Name" >
              <Button :text="location.Name" :data-location="location.Name" @button-click="locationClick" class="form-control"/>
            </li>
          </ul>
        </form>
        <router-link class="btn form-control" to="/shops" data-target="shops=">View Local Shops</router-link>
      </div>
    </div>
  </div>
</template>