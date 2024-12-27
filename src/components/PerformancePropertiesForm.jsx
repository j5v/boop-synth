import './PerformancePropertiesForm.css'
import usePatchStore from '../store/patchStore.jsx';

function PerformancePropertiesForm(props) {

  const perf = usePatchStore(
    (state) => state.perf
  );

  return (
    <div className="PerformancePropertiesForm">
      <div className="form-input-row">
        <div className="label">Sample Rate</div>
        <>{perf.sps}</>
      </div>
      <div className="form-input-row">
        <div className="label">Channels</div>
        <>{perf.channels}</>
      </div>
      <div className="form-input-row">
        <div className="label">Length</div>
        <>{perf.length}</>
      </div>
      <div className="form-input-row">
        <div className="label">Gain</div>
        <>{perf.gain.toFixed(6)}</>
      </div>
    </div>
  )
}

export default PerformancePropertiesForm
