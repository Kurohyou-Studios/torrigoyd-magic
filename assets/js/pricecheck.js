const getPrices = async (e)=>{
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '14LkK1PrfkjeTsqpHypRrRKctvIM4DZ1Dag939D8wKig',
      range:'Full!A6:C'
    });
    console.log(response);
  } catch (err) {
    console.error(err);
    return;
  }
  // const range = response.result;
  // // Flatten to string to display
  // const headers = range.values[0];
  
};

var priceInit = (src)=>{
  console.log(`==== ${src} ====`);
  console.log('gapiInited',gapiInited);
  if(!gapiInited){
    console.log('setting timeout');
    setTimeout(priceInit,500,'from timeout');
  }else{
    getPrices();
  }
};

priceInit('initial');