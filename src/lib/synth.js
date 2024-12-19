const synthNodeTypes = {
  MOCK: { id: 0, name: 'TEST' },
  GEN_FM: { id: 1, name: 'FM' },
}

const getNodeTypeById = id => {
  let found = false;
  console.log('looking for id', id);
  for (let obj in synthNodeTypes) {
    console.log('synthNodeTypes[obj]', synthNodeTypes[obj]);
    console.log('obj.id', obj.id);
    if (synthNodeTypes[obj].id == id) {
      found = synthNodeTypes[obj];
      break;
    }
  }
  return found;
} 


export {
  synthNodeTypes,
  getNodeTypeById
}