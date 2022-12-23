import { initializeGapiClient } from './gapiInit';

export const load = async function(){
  await initializeGapiClient();
  this.items = [
    {
        "Item": "Absorbing Tattoo",
        "GP": "15000",
        "Rarity": "Very Rare",
        "Source": "TCE",
        "Page": "",
        "Type": "Wondrous Items: Tattoo",
        "Attunement": "Yes",
        "Search DC": "130"
    },
    {
        "Item": "Acheron Blade",
        "GP": "900",
        "Rarity": "Rare",
        "Source": "EGW",
        "Page": "265",
        "Type": "Weapons",
        "Attunement": "Yes",
        "Search DC": "100"
    },
    {
        "Item": "Adamantine Armor",
        "GP": "250",
        "Rarity": "Uncommon",
        "Source": "DMG",
        "Page": "150",
        "Type": "Armor",
        "Attunement": "No",
        "Search DC": "71"
    }
  ];
  this.loading = false;
};