
const locationSearch = (event) => {
  console.log('event',event);
  const matches = fuzzysort.go(event.target.value,locations,{key:'Name'});
  const $lis = matches.reduce((memo,m) => {
    memo.push(...templates.locationSuggestion(m.obj));
    return memo;
  },[]);
  $locationSuggestions.replaceChildren(...$lis);
};

const activateLocation = (button) => {
  storedData.location = button.dataset.name;
  updateCampaignDisplay();
  console.log('button',button);
  halfmoon.toggleSidebar();
  $locationSuggestions.replaceChildren();
  $locationSearch.value = '';
};

const selectLocation = (event) => {
  console.log('click event',event.target);
  activateLocation(event.target);
};

$campaignSelect.addEventListener('change',(event)=>{
  storedData.campaign = event.target.value;
  storedData.location = campaigns.find(o => o.Name === event.target.value)['Current Location'];
  updateCampaignDisplay();
});

$locationSearch.addEventListener('input',locationSearch);

$locationSuggestions.addEventListener('click',selectLocation);

document.getElementById('campaign-settings').addEventListener('submit',(event) => event.preventDefault());