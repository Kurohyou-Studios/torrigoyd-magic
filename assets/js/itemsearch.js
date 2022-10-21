
const outputDetails = async (arr) => {
  await Promise.all(
    arr.map(async () => {

    })
  )
};

const calcRealCost = (location,gp) => {
  const totalMod = calcCostMod(location);
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

const calcSearchDC = (location,dc,rarity) => {
  const baseDC = +dc || null;
  if((baseDC ?? false) === false){
    if(rarity){
      return `${calcSearchDC(rarityDCs[rarity][0])} - ${calcSearchDC(rarityDCs[rarity][1])}`;
    }else{
      return 'Ask your GM';
    }
  }
  const totalMod = calcRarityMod(location);
  const total = baseDC + totalMod;
  return total;
};

const getAllSelected = (select) => 
  select && select.options ?
    [...select.options].reduce((memo,opt) => {
      if(opt.selected){
        memo.push(opt.value);
      }
      return memo;
    },[]) :
    null;

const getAllChecked = (checks) =>
  checks ?
    [...checks].reduce((memo,opt) => {
      if(opt.checked){
        memo.push(opt.value)
      }
      return memo;
    },[]) :
    null;

const outputItemRows = (location,filtered) => {
  const newContent = filtered.reduce((memo,item) => {
    const searchString = item.obj.Item.replace(/\s*\(.+\)\s*/g,'').trim();
    memo.push(...templates.itemRow({...item.obj,GP:calcRealCost(location,item.obj.GP),searchDC:calcSearchDC(location,item.obj['Search DC'],item.obj.Rarity),r20Link:`https://roll20.net/compendium/dnd5e/${searchString}`,beyondLink:`https://www.dndbeyond.com/magic-items/${searchString.replace(/\s+/g,'-')}`}));
    return memo;
  },[]);
  $resultTarget.replaceChildren(...newContent);

};

const filterItems = () => {
  const searchString = $searchInput.value;
  const attuneSearch = $attuneFilter.value;
  const rareSearch = getAllChecked($rareFilter);
  const typeSearch = getAllChecked($typeFilter);

  updateParam({
    paramArr:[
      ['item',searchString],
      ['attune',attuneSearch],
      ['rarity',rareSearch],
      ['type',typeSearch]
    ],
    reset:true
  });

  // debugger;
  const filtered = fuzzysort.go(searchString,itemContent,{all:true,keys:['Item','GP','Source']})
    .filter(item => {
      const attuneMatch = attuneSearch ?
        item.obj.Attunement === attuneSearch :
        true;
      const rarityMatch = rareSearch.length ?
        rareSearch.indexOf(item.obj.Rarity) >= 0 :
        true;
      const typeMatch = typeSearch.length ?
        typeSearch.some(t => item.obj.Type.includes(t)) :
        true;
      return attuneMatch && rarityMatch && typeMatch;
    });
  outputItemRows(activeLocation,filtered)
};

const filterInit = ()=>{
  if(itemContent.length){
    enableForms();
    filterItems();
    $searchForm.addEventListener('submit',(e)=> e.preventDefault);
    $searchForm.addEventListener('input',filterItems);
  }else{
    setTimeout(filterInit,500);
  }
};