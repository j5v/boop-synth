import { getItemById } from '../lib/utils.js'

const synthNodeVisualizationTypes = {
  VIS_WAVEFORM: {
    id: 1,
    name: 'Waveform'
  },
  VIS_SPECTRUM: {
    id: 2,
    name: 'Spectrum'
  },
  VIS_WAVESHAPER: {
    id: 3,
    name: 'Waveshaper'
  },
}
const getSynthNodeVisualizationTypeById = id => getItemById(synthNodeVisualizationTypes, id);

export {
  synthNodeVisualizationTypes,
  getSynthNodeVisualizationTypeById
}