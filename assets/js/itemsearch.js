const searchInput = document.getElementById('search-term');
const attuneFilter = document.getElementById('attune');
const rareFilter = document.getElementsByName('rarity');
const typeFilter = document.getElementsByName('type');

const searchForm = document.getElementById('item-search');
const resultTarget = document.getElementById('result-content');
const outputDetails = async (arr) => {
  await Promise.all(
    arr.map(async () => {

    })
  )
};

const calcRealCost = (gp) => {
  const campaignMod = +activeCampaign['Price Mod'] || 1;
  const cityMod = +activeLocation[`${activeCampaign.Name}: Cost`] || 1;
  const total = gp * campaignMod * cityMod;
  const gold = Math.floor(total);
  const dec = total - gold;
  const silver = Math.floor(dec * 10);
  const copper = Math.floor(Math.floor(dec * 10 - silver) * 10);
  const gpText = gold ? `${gold} GP` : '';
  const spText = silver ? `${silver} SP` : '';
  const cpText = copper ? `${copper} CP` : '';
  return [gpText,spText,cpText].filter(t=>t).join(' ');
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

const filterItems = () => {
  console.log('filtering');
  const searchString = searchInput.value;
  const attuneSearch = attuneFilter.value;
  const rareSearch = getAllChecked(rareFilter);
  const typeSearch = getAllChecked(typeFilter);
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
    
  const newContent = filtered.reduce((memo,item) => {
    const searchString = item.obj.Item.replace(/\s*\(.+\)\s*/g,'').trim();
    memo.push(...templates.itemRow({...item.obj,GP:calcRealCost(item.obj.GP),r20Link:`https://roll20.net/compendium/dnd5e/${searchString}`,beyondLink:`https://www.dndbeyond.com/magic-items/${searchString.replace(/\s+/g,'-')}`}));
    return memo;
  },[]);
  resultTarget.replaceChildren(...newContent)
}

searchForm.addEventListener('submit',(e)=> e.preventDefault);
searchForm.addEventListener('input',filterItems);
const filterInit = ()=>{
  if(itemContent.length){
    filterItems();
  }else{
    setTimeout(filterInit,500);
  }
};
filterInit();