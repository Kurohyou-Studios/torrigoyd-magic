import { useItemStore } from '@/stores/items.js';


export const costMod = (location) => {
  const store = useItemStore();
  let mod = +location[`${(store.campaign || store.campaigns[0]).Name}: Cost`] || 1;
  if(location.parent_id && store.locations[location.parent_id]){
    return mod * costMod(store.locations[location.parent_id]);
  }else{
    return mod;
  }
};

export const rarityMod = (location) => {
  const store = useItemStore();
  let mod = +location[`${(store.campaign || store.campaigns[0]).Name}: Rarity`] || 0;
  if(location.parent_id && store.locations[location.parent_id]){
    return mod + rarityMod(store.locations[location.parent_id]);
  }else{
    return mod;
  }
};

export const realCost = (location,gp) => {
  const totalMod = costMod(location);
  const total = gp * totalMod;
  const gold = Math.floor(total);
  const dec = total - gold;
  const silver = Math.floor(dec * 10);
  const copper = Math.floor(Math.floor(dec * 10 - silver) * 10);
  const gpText = gold ? `${gold} GP` : '';
  const spText = silver ? `${silver} SP` : '';
  const cpText = copper ? `${copper} CP` : '';
  return [gpText,spText,cpText].filter(t=>t).join(' ');
};

export const rarityDCs = {
  Common:[1,40],
  Uncommon:[41,80],
  Rare:[81,120],
  'Very Rare':[121,160],
  Legendary:[161,200]
};

export const searchDC = (location,dc,rarity) => {
  
  const baseDC = +dc || null;
  if((baseDC ?? false) === false){
    if(rarity){
      return `${searchDC(location,rarityDCs[rarity][0])} - ${searchDC(location,rarityDCs[rarity][1])}`;
    }else{
      return 'Ask your GM';
    }
  }
  const totalMod = rarityMod(location);
  const total = baseDC + totalMod;
  return total;
};