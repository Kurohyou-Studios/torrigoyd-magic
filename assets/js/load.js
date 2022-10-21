(()=>{
  const campaignInit = (sheet) => {
    objectifySheet({
      headers:sheet.values.shift().map((v,i)=>[v,i]),
      values:sheet.values,
      target:campaigns
    });
    campaigns.forEach((obj,i) => {
      const option = document.createElement('option');
      option.value = obj.Name;
      option.append(obj.Name);
      if(
        storedData.campaign === obj.Name ||
        (i === 0 && !storedData.campaign)
      ){
        option.selected = true;
        storedData.location = storedData.location || obj['Current Location'];
        if(!storedData.campaign && i === 0){
          storedData.campaign = obj.Name;
          localStorage.setItem('torrigoyd',JSON.stringify(storedData));
        }
      }
      $campaignSelect.append(option);
    });
  };
  
  const locationInit = (sheet) => {
    sheet.values.shift();
    objectifySheet({
      headers:sheet.values.shift().map((v,i)=>[v,i]),
      values:sheet.values,
      target:locations
    });
  };
  
  const priceInit = (sheet) => {
    const sheetHeaders = sheet.values.shift();
    itemHeaders.forEach(h => headerIndexes[h] = sheetHeaders.indexOf(h));
    const headerEntries = Object.entries(headerIndexes);
    objectifySheet({
      headers:headerEntries,
      values:sheet.values,
      target:itemContent
    });
  };

  const shopInit = (sheet) => {
    objectifySheet({
      headers:sheet.values.shift().map((v,i)=>[v,i]),
      values:sheet.values,
      target:shops
    });
  };
  
  const dataInit = async (e)=>{
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: '14LkK1PrfkjeTsqpHypRrRKctvIM4DZ1Dag939D8wKig',
        ranges:[
          'Full',
          'Campaigns',
          'Locations',
          'Stores'
        ]
      });
    } catch (err) {
      console.error(err);
      return;
    }
    const [priceSheet,campaignSheet,locationSheet,storeSheet] = response.result.valueRanges;
    priceInit(priceSheet);
    campaignInit(campaignSheet);
    locationInit(locationSheet);
    shopInit(storeSheet);
    updateCampaignDisplay();
  };
  
  var connectionInit = ()=>{
    if(!gapiInited){
      setTimeout(connectionInit,500);
    }else{
      dataInit();
    }
  };

  // Search parameter/form value syncing
  const updateSearchString = (data) => {
    $searchInput.value = data[0] || '';
  };

  const updateAttune = (data) => {
    $attuneFilter.value = data[0] || '';
  };

  const updateRarity = (data) => {
    [...$rareFilter].forEach(el => {
      if(data.indexOf(el.value) > -1){
        el.checked = true;
      }
    });
  };

  const updateType = (data) => {
    [...$typeFilter].forEach(el => {
      if(data.indexOf(el.value) > -1){
        el.checked = true;
      }
    });
  };

  const parseQuery = () => {
    const queryTargets = {
      item: updateSearchString,
      attune: updateAttune,
      rarity: updateRarity,
      type: updateType
    };
    const [USP,searchKeys] = loadBaseTemplate();
    searchKeys.forEach(key => queryTargets[key]?.(USP.getAll(key)));
  };
  
  const load = () => {
    connectionInit();
    parseQuery();
  };
  
  load();
})();