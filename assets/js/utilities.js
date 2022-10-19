const updateCampaignDisplay = () => {
  $campaignHeader.replaceChildren(storedData.campaign)
  $locationHeader.replaceChildren(storedData.location);
  activeCampaign = campaigns.find(o => o.Name === storedData.campaign);
  activeLocation = locations.find(o => o.Name === storedData.location);
  filterItems();
};