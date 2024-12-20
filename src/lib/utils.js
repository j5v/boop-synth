const newCreator = ({ defaultObject }) => {

  let id = 0;
 
  const newObject = (options) => {
    if (options.startId) {
      id = options.startId;
    } else {
      id++;
    }

    return {
      ...defaultObject,
      id,
      ...options
    }
  }
  return {
    newObject
  }
}

const asRem = x => x + 'rem';  

const remAsPx = rem => {    
  return rem * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
}
const pxAsRem = pix => {    
  return pix / (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
}

export {
  newCreator,
  asRem,
  remAsPx,
  pxAsRem
}