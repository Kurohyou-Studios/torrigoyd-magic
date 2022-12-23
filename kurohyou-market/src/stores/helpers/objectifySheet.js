export const objectifySheet = ({headers,values,target}) => 
  values.forEach(arr => {
    const obj = {};
    headers.forEach(([head,i])=>{
      obj[head] = arr[i];
    });
    target.push(obj);
  });