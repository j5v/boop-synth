import { memo } from 'react';

import './PerformancePropertiesForm.css'
import usePatchStore from '../../store/patchStore.jsx';
import { defaultOutputSpec } from '../../lib/synthGraphUtils.js';

const PerformancePropertiesForm = memo(function PerformancePropertiesForm(props) {

  const perf = usePatchStore.getState().perf;

  return (
    <div className="PerformancePropertiesForm">
      <div className="form-input-row">
        <div className="label">Sample rate<span className="units">, sps</span></div>
        <>{(perf.sampleRate || defaultOutputSpec.sampleRate)}</>
      </div>
      <div className="form-input-row">
        <div className="label">Oversample<span className="units">, factor</span></div>
        <>{(perf.oversample || defaultOutputSpec.oversample)}</>
      </div>
      <div className="form-input-row">
        <div className="label">Duration<span className="units">, s</span></div>
        <>{(perf.duration || defaultOutputSpec.duration).toFixed(2)}</>
      </div>
      <div className="form-input-row">
        <div className="label">Sustain time<span className="units">, ms</span></div>
        <>{(perf.sustainReleaseTime || defaultOutputSpec.sustainReleaseTime).toFixed(2)}</>
      </div>
      <div className="form-input-row">
        <div className="label">Root frequency<span className="units">, Hz</span></div>
        <>{perf.freq.toFixed(4)}</>
      </div>
    </div>
  )
})

export default PerformancePropertiesForm
