<script setup>
  import { useItemStore } from '@/stores/items.js';
  const itemStore = useItemStore();
  const props = defineProps({
    item: Object
  });
  function makeHREF(type){
    const searchString = this.props.item.Item.replace(/\s*\(.+\)\s*|,/g,'').trim();
    return type === 'r20' ?
      `https://roll20.net/compendium/dnd5e/${searchString}` :
      `https://www.dndbeyond.com/magic-items/${searchString.replace(/\s+/g,'-').replace(/\+|'/g,'')}`;
  };
</script>
<template>
  <li class="card row align-items-center gap-5">
    <span class="name col card-title">{{ item.Item }}</span>
    <span class="type col-1">{{ item.Type }}</span>
    <span class="gp col-1 font-weight-bold">{{ item.realCost }}</span>
    <div class="col-2 d-flex flex-column gap-5 rarity">
      <span :class="item.Rarity">{{ item.Rarity }}</span>
      <span v-if="item.realDC">Check: {{ item.realDC }}</span>
    </div>
    <span class="source col-1">{{ item.Source }}</span>
    <div class="attune col-1 d-flex justify-content-center align-items-center">
      <div class="attune-border">
        <span >{{ item.Attunement === 'Yes' ? '✓' : '' }}</span>
      </div>
    </div>
    <a :href="makeHREF('beyond')" class="col-1 d-flex justify-content-center align-items center" target="_blank">
      <img src="@/assets/images/dndbeyondlogo.png" alt="DND Beyond Entry" class="external-logo" width="30px">
    </a>
    <a :href="makeHREF('r20')" class="col-1 d-flex justify-content-center align-items center" target="_blank">
      <img src="@/assets/images/r20logo.png" alt="Roll20 Compendium Entry" class="external-logo" width="30px">
    </a>
  </li>
</template>

<style scoped>
  .external-logo{
    height:30px;
    width:auto;
  }
</style>