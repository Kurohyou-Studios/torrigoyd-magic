const searchForm = document.getElementById('item-search');
const resultTarget = document.getElementById('result-content');
const outputDetails = async (arr) => {
  await Promise.all(
    arr.map(async () => {

    })
  )
};

const filterItems = (event) => {
  const searchString = event.target.value;
  console.log('searchString',searchString)
  const filtered = fuzzysort.go(searchString,itemContent,{keys:['Item','GP','Rarity','Source','Type']});
  const newContent = filtered.reduce((memo,item) => {
    const searchString = item.obj.Item.replace(/\s*\(.+\)\s*/g,'').trim();
    memo.push(...templates.itemRow({...item.obj,r20Link:`https://roll20.net/compendium/dnd5e/${searchString}`,beyondLink:`https://www.dndbeyond.com/magic-items/${searchString.replace(/\s+/g,'-')}`}));
    return memo;
  },[]);
  console.log('newcontent',newContent);
  resultTarget.replaceChildren(...newContent)
}

searchForm.addEventListener('submit',(e)=> e.preventDefault);
searchForm.addEventListener('input',filterItems);