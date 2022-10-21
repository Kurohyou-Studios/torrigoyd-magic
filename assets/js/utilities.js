const updateCampaignDisplay = () => {
  $campaignHeader.replaceChildren(storedData.campaign)
  updateBreadCrumb(storedData.location)
  activeCampaign = campaigns.find(o => o.Name === storedData.campaign);
  activeLocation = locations.find(o => o.Name === storedData.location);
  switch('object'){
    case typeof $shopContainer:
      shopInit();
      break;
    case typeof $searchForm:
      filterInit();
      break;
  }
};

const updateParam = ({paramArr,reset=false}) => {
  const USP = new URLSearchParams(window.location.search);
  if(reset){
    for(key of USP.keys()){
      USP.delete(key);
    }
  }
  paramArr.forEach(([param,data])=>{
    if(!data || (Array.isArray(data) && !data.length)){
      return USP.delete(param);
    }
    if(Array.isArray(data)){
      USP.delete(param);
      data.forEach(d => USP.append(param,d));
    }else{
      USP.set(param,data);
    }
  });
  const RPQ = `${window.location.pathname}?${USP.toString()}`;
  history.pushState(null,'',RPQ);
};

const objectifySheet = ({headers,values,target}) => 
  values.forEach(arr => {
    const obj = {};
    headers.forEach(([head,i])=>{
      obj[head] = arr[i];
    });
    target.push(obj);
  });

const updateBreadCrumb = (crumbString) => {
  $breadcrumb.replaceChildren();
  crumbString.split('::').forEach((crumb, i,arr) => {
    const queryVal = i > 1 ?
      crumb :
      '';
    const query = i >= 1 ?
      `${arr[1]}=${queryVal}` :
      '';
    const active = i === arr.length - 1 ?
      'active' :
      '';
    $breadcrumb.append(...templates.breadcrumbItem({crumb,query,active}))
  });
};

const loadBaseTemplate = (USP = new URLSearchParams(window.location.search)) => {
  const searchKeys = [...USP.keys()];
  switch(true){
    case searchKeys.indexOf('shops') > -1:
      $main.replaceChildren(...templates.shopMain({}));
      $shopContainer = document.getElementById('shops');
      $searchInput = undefined;
      $attuneFilter = undefined;
      $rareFilter = undefined;
      $typeFilter = undefined;
      $searchForm = undefined;
      $resultTarget = undefined;
      break;
    default:
      $main.replaceChildren(...templates.itemSearch({}));
      $shopContainer = undefined;
      $searchInput = document.getElementById('search-term');
      $attuneFilter = document.getElementById('attune');
      $rareFilter = document.getElementsByName('rarity');
      $typeFilter = document.getElementsByName('type');
      $searchForm = document.getElementById('item-search');
      $resultTarget = document.getElementById('result-content');
  }
  return [USP,searchKeys];
};

const calcCostMod = (location) => {
  let mod = +location[`${activeCampaign.Name}: Cost`] || 1;
  if(location.parent_id && locations[location.parent_id]){
    return mod * calcCostMod(locations[location.parent_id]);
  }else{
    return mod;
  }
};

const calcRarityMod = (location) => {
  let mod = +location[`${activeCampaign.Name}: Rarity`] || 0;
  if(location.parent_id && locations[location.parent_id]){
    return mod + calcRarityMod(locations[location.parent_id]);
  }else{
    return mod;
  }
};

const enableForms = () => {
  const forms = document.getElementsByTagName('form');
  if(forms.length){
    [...forms].forEach(form => [...form.children].forEach(el => el.removeAttribute('disabled')));
  }
}