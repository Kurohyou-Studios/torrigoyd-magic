<script setup>
import { useItemStore } from '@/stores/items';
const itemStore = useItemStore();
const props = defineProps({
  id:{
    type: String
  },
  options:{
    type: Array
  },
  selection:{
    type: Object
  }
});
const isSelected = (selection,option) => option.value === selection;
const emit = defineEmits(['change']);
</script>
<template>
  <select @change="(event)=>$emit('change',event)" class="form-control" :id="props.id" >
    <option v-for="option in props.options" :key="option.value" :selected="isSelected(props.selection,option)" :value="option.value">{{ option.text ?? option.value }}</option>
  </select>
</template>