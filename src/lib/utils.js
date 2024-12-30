const newCreator = ({ defaultObject }) => {

  let id = 0;
 
  const newObject = (options) => {
    if (options.startId) {
      id = options.startId;
    } else {
      id++;
    }

    return {
      ...structuredClone(defaultObject),
      id,
      ...structuredClone(options)
    }
  }
  return {
    newObject
  }
}

const asRem = x => `${x}rem`

const remAsPx = rem => {    
  return rem * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
}
const pxAsRem = pix => {    
  return pix / (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
}

function swapItemsInArray(items, firstIndex, secondIndex) {
  // source: https://stackoverflow.com/questions/41127548/how-do-i-swap-array-elements-in-an-immutable-fashion-within-a-redux-reducer
  const results = items.slice();
  const firstItem = items[firstIndex];
  results[firstIndex] = items[secondIndex];
  results[secondIndex] = firstItem;

  return results;
}

const joinItems = (arr, separator = ', ') => arr.filter(i => i > '').join(' - ');


export {
  newCreator,
  asRem,
  remAsPx,
  pxAsRem,
  swapItemsInArray,
  joinItems,
}