const headerIndexes = {
  'Item':-1,
  'GP':-1,
  'Rarity':-1,
  'Source':-1,
  'Page':-1,
  'Type':-1,
  'Attunement':-1
}
const itemHeaders = Object.keys(headerIndexes);
let itemContent;
const getPriceData = async (e)=>{
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '14LkK1PrfkjeTsqpHypRrRKctvIM4DZ1Dag939D8wKig',
      range:'Full'
    });
  } catch (err) {
    console.error(err);
    return;
  }
  const sheetHeaders = response.result.values.shift();
  itemHeaders.forEach(h => headerIndexes[h] = sheetHeaders.indexOf(h));
  console.log('headerIndexes',headerIndexes);
  const headerEntries = Object.entries(headerIndexes);
  itemContent = response.result.values.map(arr => 
    headerEntries.reduce((memo,[head,i])=>{
      memo[head] = arr[i];
      return memo;
    },{})
  );
  console.log('itemContent',itemContent);
  const searchForm = document.getElementById('item-search');
  if(searchForm){
    [...searchForm.children].forEach(el => el.removeAttribute('disabled'));
  }
  const resultHeadDiv = document.getElementById('result-header');
};



var priceInit = (src)=>{
  if(!gapiInited){
    console.log('setting timeout');
    setTimeout(priceInit,500,'from timeout');
  }else{
    console.log('Initializing price data');
    getPriceData();
  }
};

priceInit('initial');