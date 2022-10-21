const followBreadcrumb = (event) => {
  if(event.target.dataset.hasOwnProperty('target')){
    history.pushState(null,'',`${window.location.pathname}?${event.target.dataset.target}`);
    loadBaseTemplate();
    updateCampaignDisplay();
  }
};

document.body.addEventListener('click',followBreadcrumb);