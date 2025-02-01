import { memo } from 'react';

import './PerformancePropertiesForm.css'
import usePatchStore from '../../store/patchStore.jsx';
import { defaultPerf } from '../../lib/synthGraphUtils.js';

const PerformancePropertiesForm = memo(function PerformancePropertiesForm(props) {

  const perf = usePatchStore.getState().perf;
  const setPerf = usePatchStore.getState().setPerf;

  const handleChangePerf = (event, key) => {
    setPerf(key, parseFloat(event.target.value));
  }

  return (
    <div className="PerformancePropertiesForm">
      <div className="form-input-row">
        <div className="label">Sample rate<span className="units">, sps</span></div>
        <input
          className={`number`}
          onBlur={(e) => handleChangePerf(e, 'sampleRate')}
          defaultValue={perf.sampleRate || defaultPerf.sampleRate}
          title="Base sample rate. Ensure this rate is supported by your devices."
        ></input>
      </div>
      <div className="form-input-row">
        <div className="label">Oversample<span className="units">, factor</span></div>
        <input
          className={`number`}
          onBlur={(e) => handleChangePerf(e, 'oversample')}
          defaultValue={perf.oversample || defaultPerf.oversample}
          title="Factor for internal oversampling"
        ></input>
      </div>
      <div className="form-input-row">
        <div className="label">Duration<span className="units">, s</span></div>
        <input
          className={`number`}
          onBlur={(e) => handleChangePerf(e, 'duration')}
          defaultValue={perf.duration || defaultPerf.duration}
          title="Duration of the sample, seconds"
        ></input>
      </div>
      <div className="form-input-row">
        <div className="label">Sustain time<span className="units">, ms</span></div>
        <input
          className={`number`}
          onBlur={(e) => handleChangePerf(e, 'sustainReleaseTime')}
          defaultValue={perf.sustainReleaseTime || defaultPerf.sustainReleaseTime}
          title="Time in seconds, for the release phase"
        ></input>
      </div>
      <div className="form-input-row">
        <div className="label">Root frequency<span className="units">, Hz</span></div>
        <input
          className={`number`}
          onBlur={(e) => handleChangePerf(e, 'freq')}
          defaultValue={perf.freq || defaultPerf.freq}
          title="Reference frequency"
        ></input>
      </div>

  </div>
)
})

export default PerformancePropertiesForm
