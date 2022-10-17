const parser = new DOMParser();
// Gets the content of a template element

// Handlebar custom helpers

const requiresAttunement = (attunement) => /yes/i.test(attunement);
Handlebars.registerHelper('requiresAttune',requiresAttunement);
// End custom helpers

const createTemplate = (el) => {
  const template = Handlebars.compile(el.innerHTML);
  return (obj={}) => {
    const tempDoc = parser.parseFromString(template(obj),'text/html')
    return tempDoc.body.childNodes;
  };
};

// Gets the content of the template indicated by the id
const createTemplateFromID = (id) => getTemplateContent(document.getElementById(id));

const templates = [...document.getElementsByTagName('template')]
  .reduce((m,el)=>{
    console.log('innerHTML',el.innerHTML);
    m[el.id] = createTemplate(el);
    return m;
  },{});
console.log('templates',templates);