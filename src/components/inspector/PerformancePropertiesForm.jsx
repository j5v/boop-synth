import './PerformancePropertiesForm.css'
import usePatchStore from '../../store/patchStore.jsx';

function PerformancePropertiesForm() {

  const perf = usePatchStore((state) => state.perf);

  return (
    <div className="PerformancePropertiesForm">
      <div className="form-input-row">
        <div className="label">Sample Rate<span className="units">, sps</span></div>
        <>{perf.sampleRate}</>
      </div>
      <div className="form-input-row">
        <div className="label">Channels</div>
        <>{perf.channels}</>
      </div>
      <div className="form-input-row">
        <div className="label">Duration<span className="units">, s</span></div>
        <>{perf.duration.toFixed(6)}</>
      </div>
      <div className="form-input-row">
        <div className="label">Root Frequency<span className="units">, Hz</span></div>
        <>{perf.freq.toFixed(4)}</>
      </div>
      <div className="form-input-row">
        <div className="label">Gain</div>
        <>{perf.gain.toFixed(4)}</>
      </div>
    </div>
  )
}

export default PerformancePropertiesForm
