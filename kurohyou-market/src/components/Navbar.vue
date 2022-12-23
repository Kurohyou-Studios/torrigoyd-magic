<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useItemStore } from '@/stores/items';
const route = useRoute();
const itemStore = useItemStore();
const campaignName = computed(()=>itemStore.campaign?.Name || '');
const locationName = computed(function(){
  console.log('locationName this',this);
  return itemStore.location?.Name
});
</script>
<template>
  <div class="navbar">
    <div class="navbar-content">
      <button class="btn btn-action material-icons" id="toggle-sidebar-btn" type="button" onclick="halfmoon.toggleSidebar()">menu</button>
    </div>
    <div class="navbar-content d-flex gap-10 align-items-end">
      <span class="align-self-start font-size-24 m-0" id="active-campaign">{{ campaignName }}</span>
      <nav aria-label="Location breadcrumb">
        <ul class="breadcrumb" id="location-breadcrumb">
          <li class="font-size-16" v-for="crumb in route.meta.breadCrumb" :key="crumb.text" :class="`${(crumb.active || '')} breadcrumb-item`">
            <router-link v-if="crumb.path" :to="crumb.path">{{ crumb.text?.value || crumb.text }}</router-link>
            <span v-else>{{ crumb.text?.value || crumb.text }}</span>
          </li>
        </ul>
      </nav>
    </div>
    <header class="navbar-content ml-auto align-self-start">
      <h1 class="font-size-20 m-0">Kurohyou's Market</h1>
    </header>
  </div>
</template>