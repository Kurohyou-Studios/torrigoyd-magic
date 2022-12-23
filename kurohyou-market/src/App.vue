<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';

import { useItemStore } from '@/stores/items.js';

const itemStore = useItemStore();
const route = useRoute();
const { loading } = storeToRefs(itemStore);
const updateActiveShop = (to = [null,route],from) => {
  itemStore.$patch({
    activeShopID: to[1].params?.shopID || null
  });
};
watch(
  [loading,route],
  updateActiveShop
);
</script>
<template>
  <div class="sidebar-overlay" onclick="halfmoon.toggleSidebar()"></div>
  <Navbar />
  <Sidebar />
  <main id="main-page" class="content-wrapper">
    <router-view></router-view>
  </main>
</template>
<style>
/* Global Styles */
:root {
  --gap: 1rem;
  --lm-button-link-box-shadow-focus:transparent;
}
.card{
  margin:0;
}
.p-content{
  padding:var(--content-and-card-spacing);
}
.page-wrapper {
  max-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
}

.result-header {
  padding-block: 0;
  margin-block: 0;
  border-color: transparent;
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--lm-card-bg-color);
  border-radius: 0;
}

.result-header *:not(:first-child) {
  text-align: center
}

.result-header> :first-child {
  padding-left: 10px;
}

.results {
  overflow-y: auto;
}

#result-content> :first-child {
  margin-top: 0;
}

li {
  list-style: none;
}

li > :not(.card-title) {
  text-align: center;
}

.rarity {
  font-weight: bold;
}

.Uncommon {
  color: #1FC219;
}

.Rare {
  color: #4990E2;
}

.Very.Rare {
  color: #9810E0;
}

.Legendary,
.Artifact {
  color: #BE8972;
}

.attune-border {
  border: 1px solid grey;
  border-radius: 5px;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
}

.attune-border span {
  font-size: 200%;
  line-height: 100%;
  position: relative;
  top: -20px;
  font-weight: bold;
}

.gap-5 {
  gap: calc(var(--gap) / 2);
}

.gap-10 {
  gap: var(--gap);
}

.gap-15 {
  gap: calc(var(--gap) * 1.5);
}

.gap-20 {
  gap: calc(var(--gap) * 2);
}

form {
  padding-top: var(--gap);
  width: fit-content;
  max-width: 80vw;
  margin-inline: auto;
}

.pseudo-select {
  display: flex;
  border: var(--input-border-width) solid var(--lm-input-border-color);
  background-color: var(--lm-input-bg-color);
  box-shadow: var(--lm-input-box-shadow);
  border-radius: var(--input-border-radius);
  padding-inline: var(--input-horizontal-padding);
  min-height:var(--input-height);
}

.pseudo-option>input[type="checkbox"] {
  display: none;
}
button{
  cursor: pointer;
}
.pseudo-option>span {
  padding-inline: 0.5rem;
  cursor: pointer;
}

.pseudo-option>input:checked+span {
  background-color: rgb(206, 206, 206);
}
.no-list{
  list-style:none;
}

.breadcrumb{
  margin:0;
}

#shops{
  padding:var(--content-and-card-spacing);
}
</style>
