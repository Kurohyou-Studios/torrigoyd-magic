<script setup>
import { useItemStore } from '@/stores/items';
const itemStore = useItemStore();

</script>
<template>
  <div class="p-content">
    <ul class="row justify-content-center gap-5">
      <li 
        v-for="shop in itemStore.localShops"
        :key="shop.id"
        class="m-0 d-flex">
        <router-link class="card" :to="`/shops/${shop.id}`">
          <span class="card-title">{{shop.Name}}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>