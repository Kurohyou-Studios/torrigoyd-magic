const showButtons = () => {
  const localShops = shops.reduce((memo,obj,index) => {
    if(obj.Location === activeLocation.Name){
      memo.push({...obj,index});
    }
    return memo;
  },[]);
  
  updateBreadCrumb(`${activeLocation.Name}::shops`);
  if(!localShops.length){
    $shopContainer.replaceChildren(...templates.noShops(activeLocation));
    return;
  }
  const shopButtons = localShops.reduce((memo,shop,i)=>{
    memo.push(...templates.shopButton({...shop}));
    return memo;
  },[]);
  $shopContainer.replaceChildren(...templates.shopList());
  $shopContainer.querySelector('ul').append(...shopButtons);
};

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

const getItemOfTypeRarity = (type,rarity) => {
  const typeSearch = fuzzysort.go(type,itemContent,{key:'Type'}).map(item => item.obj);
  const raritySearch = typeSearch.filter(obj => obj.Rarity === rarity);
  return raritySearch[Math.floor(Math.random() * raritySearch.length)];
};

const generateShopData = (shop) => {
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
  const rarityMod = calcRarityMod(shop);
  const shopRarities = Object.entries(rarityDCs).reduce((memo,[rarity,arr])=>{
    memo[rarity] = [arr[0] + rarityMod,arr[1] + rarityMod];
    return memo;
  },{});
  const rarityLine = Object.values(shopRarities).map(r => r[0]);
  const randomRarity = () =>{
    const bound = lowerBound(rarityLine,rollRarityCheck());
    return Object.keys(shopRarities)[bound];
  };
  const stockNames = [];
  const stockContent = [...Array(stockNum).keys()].reduce((memo,n)=>{
    const type = randomType();
    const rarity = randomRarity();
    const itemObj = getItemOfTypeRarity(type,rarity);
    console.log(`${type}/${rarity} itemObj`,itemObj);
    if(!itemObj) return memo;
    const searchString = itemObj.Item.replace(/\s*\(.+\)\s*/g,'').trim();
    stockNames.push(itemObj.Item);
    memo.push(...templates.itemRow({...itemObj,GP:calcRealCost(shop,itemObj.GP),r20Link:`https://roll20.net/compendium/dnd5e/${searchString}`,beyondLink:`https://www.dndbeyond.com/magic-items/${searchString.replace(/\s+/g,'-')}`}))
    return memo;
  },[]);
  storedData.shops = storedData.shops || {};
  storedData.shops[activeShop.Name] = stockNames;
  $resultTarget.replaceChildren(...stockContent);
};

const loadShopInventory = (shop,stock) => {
  const stockContent = stock.reduce((memo,name)=>{
    const itemObj = itemContent.find(obj => obj.Item === name);
    const searchString = itemObj.Item.replace(/\s*\(.+\)\s*/g,'').trim();
    memo.push(...templates.itemRow({...itemObj,GP:calcRealCost(shop,itemObj.GP),r20Link:`https://roll20.net/compendium/dnd5e/${searchString}`,beyondLink:`https://www.dndbeyond.com/magic-items/${searchString.replace(/\s+/g,'-')}`}));
    return memo;
  },[]);
  $resultTarget.replaceChildren(...stockContent);
};

const loadShop = (index) => {
  activeShop = {...shops[index]};
  updateBreadCrumb(`${activeLocation.Name}::shops::${activeShop.Name}`);
  const shopContent = templates.shopDetail(activeShop);
  $shopContainer.replaceChildren(...shopContent);
  $resultTarget = document.getElementById('result-content');
  $shopContainer.removeEventListener('click',shopClick);
  
  storedData.shops?.[activeShop.Name] ?
    loadShopInventory(activeShop,storedData.shops?.[activeShop.Name]) :
    generateShopData(activeShop);
};

const refreshShop = () => {
  console.log('refreshing');
  generateShopData(activeShop);
  console.log('done');
};

const shopClick = (event) => {
  const button = event.target.tagName === 'BUTTON' ?
    event.target :
    event.target.parentElement;
  if(button.tagName !== 'BUTTON'){
    return;
  }
  updateParam({paramArr:[['shops',button.dataset.index]]});
  loadShop(button.dataset.index);
  console.log('shopClick finished');
};

const shopInit = () => {
  if(shops.length && activeLocation){
    enableForms();
    $shopContainer.addEventListener('click',shopClick);
    const USP = new URLSearchParams(window.location.search);
    const shop = USP.get('shops');
    shop ?
      loadShop(shop) :
      showButtons();
  }else{
    setTimeout(shopInit,500);
  }
};