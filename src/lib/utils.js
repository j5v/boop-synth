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

export {
  newCreator,
  asRem
}