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


// Conversions: browser units

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


// Conversions: audio

const signalToDecibelsFS = (signal) => (10 * Math.log10(signal));


// Node operations

const joinItems = (arr, separator = ', ') => arr.filter(i => i > '').join(' - ');

const cleanNodeLinks = (nodes) => {
  // Delete any links that fail to resolve to target outputs.
  nodes.forEach(n => {
    n.inputs.forEach(i => {
      if (i && i.link) {
        const link = i.link; // alias
        const outputSynthNode = nodes.find(n => n.id == link.synthNodeId);
        if ( !(outputSynthNode && outputSynthNode.outputs.find(output => output.id == link.outputId)) ) {
          delete i.link;
        }
      }
    })
  })

  return nodes;
}

export {
  newCreator,
  asRem,
  remAsPx,
  pxAsRem,

  signalToDecibelsFS,

  swapItemsInArray,
  joinItems,
  cleanNodeLinks,
}