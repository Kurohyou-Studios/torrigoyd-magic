<script setup>
import { storeToRefs } from 'pinia';
import { useItemStore } from '@/stores/items';
import { useRoute } from 'vue-router';

import * as calc from '@/assets/js/calculators';
import Items from '@/components/Items.vue';
import Button from '@/components/Button.vue';

const route = useRoute();
const itemStore = useItemStore();
const { inventories,shops } = storeToRefs(itemStore);
const shopName = shops[route.params.shopID]?.Name;
route.meta.breadCrumb[2].text = shopName;

</script>
<template>
  <div class="p-content">
    <div class="d-flex flex-column card align-items-center">
      <h1>{{itemStore.shops[route.params.shopID]?.Name}}</h1>
      <p>{{itemStore.shops[route.params.shopID]?.Description}}</p>
      <Button text="refresh" @button-click="itemStore.refreshActiveInventory" class="material-icons btn align-self-center"/>
    </div>
    <Items v-if="!itemStore.loading" :items="itemStore.activeInventory" />
  </div>
</template>