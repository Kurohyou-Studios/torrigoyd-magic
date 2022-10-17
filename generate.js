const pug = require('pug');
const fs = require('fs/promises');

(async () => {
  const dir = await fs.readdir('./assets/pug');
  for await (let dirent of dir){
    if(!dirent.startsWith('_') && dirent.endsWith('.pug')){
      const html = pug.renderFile(`./assets/pug/${dirent}`,{pretty:true});
      const htmlName = dirent.replace(/\.pug$/,'.html');
      await fs.writeFile(`./${htmlName}`,html);
      console.log(`${htmlName} updated`);
    }
  }
  console.log(`All source code updated`);
})();