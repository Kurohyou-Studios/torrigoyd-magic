import { useItemStore } from "../items";
import * as calc from '@/assets/js/calculators';
import * as fuzzysort from "fuzzysort";

const lowerBound = (arr,t) => {
  const getBound = (target,low=0,high = arr.length - 1) => {
    if(low === high){
      return low;
    }
    const midPoint = Math.floor((low + high) / 2);
  
    if(target < arr[midPoint]){
      return getBound(target,low,midPoint);
    }else if(target > arr[midPoint]){
      return getBound(target,midPoint + 1, high);
    }else{
      return midPoint + 1;
    }
  };
  return getBound(t);
};

const explodingd100 = (orig) => {
  let d100 = Math.ceil(Math.random() * 100);
  if(
    d100 <= 5 &&
    (!orig || orig <= 5)
  ){
    d100 -= explodingd100(orig || d100);
  }else if(
    d100 > 95 &&
    (!orig || orig > 95)
  ){
    d100 += explodingd100(orig || d100);
  }
  return d100;
};

const explodingd20 = (orig) => {
  let d20 = Math.ceil(Math.random() * 20);
  if(
    d20 === 1 &&
    (!orig || orig === 1)
  ){
    d20 -= explodingd20(orig || d20);
  }else if(
    d20 > 19 &&
    (!orig || orig > 19)
  ){
    d20 += explodingd20(orig || d20);
  }
  return d20;
}

const rollRarityCheck = () => explodingd100() + explodingd20();

const getItemOfTypeRarity = (itemStore,type,rarity) => {
  const typeSearch = fuzzysort.go(type,itemStore.items,{key:'Type'}).map(item => item.obj);
  const raritySearch = typeSearch.filter(obj => obj.Rarity === rarity);
  return raritySearch[Math.floor(Math.random() * raritySearch.length)];
};

export const generateStore = (event) => {
  const itemStore = useItemStore();
  const shops = itemStore.shops;
  const shop = shops[itemStore.activeShopID];
  if(!shop){
    return null;
  }
  
  const stockNum = 1 + Math.round(shop['Average Stock'] * (1.5 - Math.random()));
  const itemTypes = ['Weapons','Armor','Scrolls','Wands','Staffs','Wondrous Items','Potions','Rods'];
  let lineTotal = 0;
  const typeLine = itemTypes.map((key) => {
    lineTotal = (+shop[key] || 0) + lineTotal;
    return lineTotal;
  });
  const randomType = () => {
    const bound = lowerBound(typeLine,Math.random());
    return itemTypes[bound];
  };
  const rarityMod = calc.rarityMod(shop);
  const shopRarities = Object.entries(calc.rarityDCs).reduce((memo,[rarity,arr])=>{
    memo[rarity] = [arr[0] + rarityMod,arr[1] + rarityMod];
    return memo;
  },{});
  const rarityLine = Object.values(shopRarities).map(r => r[0]);
  const randomRarity = () =>{
    const bound = lowerBound(rarityLine,rollRarityCheck());
    return Object.keys(shopRarities)[bound];
  };
  const stockNames = [...Array(stockNum).keys()].reduce((memo,n)=>{
    const type = randomType();
    const rarity = randomRarity();
    const itemObj = getItemOfTypeRarity(itemStore,type,rarity);
    if(!itemObj) return memo;
    memo.push(itemObj.Item);
    return memo;
  },[]);
  return stockNames
};