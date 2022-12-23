<script setup>
import Item from './Item.vue';
import { useItemStore } from '@/stores/items.js';
const itemStore = useItemStore();
const props = defineProps({
  items: Array
});
</script>
<template>
  <div>
    <div class="card row result-header gap-5">
      <h4 class="col">Item</h4>
      <h4 class="col-1">Type</h4>
      <h4 class="col-1">Cost</h4>
      <h4 class="col-2">Rarity</h4>
      <h4 class="col-1">Source</h4>
      <h4 class="col-1">Attune</h4>
      <h4 class="col-2">Compendia</h4>
    </div>
    <ul v-if="!itemStore.loading" class="d-flex flex-column gap-5">
      <Item :key="item.Item" v-for="item in props.items" :item="item" />
    </ul>
  </div>
</template>