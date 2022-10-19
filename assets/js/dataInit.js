
const objectifySheet = ({headers,values,target}) => 
  values.forEach(arr => {
    const obj = {};
    headers.forEach(([head,i])=>{
      obj[head] = arr[i];
    });
    target.push(obj);
  });

const campaignInit = (sheet) => {
  console.log('sheet',sheet);
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

const dataInit = async (e)=>{
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: '14LkK1PrfkjeTsqpHypRrRKctvIM4DZ1Dag939D8wKig',
      ranges:[
        'Full',
        'Campaigns',
        'Locations'
      ]
    });
  } catch (err) {
    console.error(err);
    return;
  }
  const [priceSheet,campaignSheet,locationSheet] = response.result.valueRanges;
  priceInit(priceSheet);
  campaignInit(campaignSheet);
  locationInit(locationSheet);
  updateCampaignDisplay();
  console.log('itemContent',itemContent);
  const forms = document.getElementsByTagName('form');
  if(forms.length){
    [...forms].forEach(form => [...form.children].forEach(el => el.removeAttribute('disabled')));
  }
};



var connectionInit = (src)=>{
  if(!gapiInited){
    console.log('setting timeout');
    setTimeout(connectionInit,500,'from timeout');
  }else{
    console.log('Initializing price data');
    dataInit();
  }
};

connectionInit('initial');