import { getItemById } from './utils.js'

const synthNodeVisualizationTypes = {
  WAVEFORM: {
    id: 1,
    name: 'Waveform'
  },
  SPECTRUM: {
    id: 2,
    name: 'Spectrum'
  },
  WAVESHAPER: {
    id: 3,
    name: 'Waveshaper'
  },
}
const getSynthNodeVisualizationTypeById = id => getItemById(synthNodeVisualizationTypes, id);

export {
  synthNodeVisualizationTypes,
  getSynthNodeVisualizationTypeById
}