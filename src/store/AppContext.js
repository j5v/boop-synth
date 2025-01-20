import { createContext } from 'react';

const defaultBoopState = {
  outputBuffers: []
};

const BoopContext = createContext(defaultBoopState);

export {
  BoopContext,
  defaultBoopState
};