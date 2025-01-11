const stagesWAHDSR = {
  WAIT: 1,
  ATTACK: 2,
  HOLD: 3,
  DECAY: 4,
  SUSTAIN: 5,
  RELEASE: 6
}

const initEnvelope = (node, sustainReleaseTime) => {
  node.env = {
    stage: stagesWAHDSR.WAIT,
    timeMs: 0,
    startTime: 0,
    previousEnvOutValue: 0,
    sustainReleaseTime
  };
};

const processEnvelope = (env, inputSignals, sampleRate) => {
  const [ signal, waitTime, attackTime, holdTime, decayTime, sustainLevel, releaseTime, retrigger, amp ] = inputSignals;
  const msToSampleCount = sampleRate * 0.001;
  const sampleCountToMs = 1000 / sampleRate;

  env.previousTrigger = env.previousTrigger || 0;
  if (env.previousTrigger <= 0 && retrigger > 0) {
    env.startTime = env.timeMs;
    env.stage = stagesWAHDSR.WAIT;
  }

  // default value, before stages
  env.outValue = 0;

  switch (env.stage) {
    // For zero-duration stages, flow can slip into the next stage on the same iteration.
    // Note selective use of `break`

    case stagesWAHDSR.WAIT:
      if (env.timeMs >= waitTime) {
        env.stage = stagesWAHDSR.ATTACK;
        env.startAttackTimeMs = env.timeMs;
        env.previousEnvOutValue = Math.min(1, env.previousEnvOutValue);
      } else break;

    case stagesWAHDSR.ATTACK:
      if (env.timeMs >= env.startAttackTimeMs + attackTime || env.timeMs >= env.sustainReleaseTime) {
        env.stage = stagesWAHDSR.HOLD;
        env.startHoldTimeMs = env.timeMs;
      } else {
        const attackTimeAsSamples = attackTime * msToSampleCount;
        const logOf2 = Math.log(2);
        const attackFactor = logOf2 / attackTimeAsSamples;
        env.outValue = Math.min(1, env.previousEnvOutValue + (1 - env.previousEnvOutValue) * attackFactor * 8);
        break;
      }

    case stagesWAHDSR.HOLD:
      env.outValue = 1;
      if (env.timeMs >= env.startHoldTimeMs + holdTime || env.timeMs >= env.sustainReleaseTime) {
        env.stage = stagesWAHDSR.DECAY;
        env.startDecayTimeMs = env.timeMs;
      } else {
        break;
      }

    case stagesWAHDSR.DECAY:
      // `decayTime`: Time (millisceonds) the envelope takes to reach halfway towards `sustainLevel`.
      // The envelope converges on, but does not reach, `sustainLevel`, so there is no SUSTAIN stage.
      if (env.timeMs >= env.sustainReleaseTime) {
        env.stage = stagesWAHDSR.RELEASE;
      } else {
        const decayTimeAsSamples = decayTime * msToSampleCount;
        const decayFactor = 1 - Math.pow(0.5, 1 / decayTimeAsSamples);
        env.outValue = env.previousEnvOutValue - (env.previousEnvOutValue - sustainLevel) * decayFactor;
        break;
      }

    case stagesWAHDSR.RELEASE:
      const releaseTimeAsSamples = releaseTime * msToSampleCount;
      const releaseFactor = Math.pow(0.5, 1 / releaseTimeAsSamples);
      env.outValue = env.previousEnvOutValue * releaseFactor;
      break;
  }

  env.previousEnvOutValue = env.outValue;
  env.previousTrigger = env.retrigger;

  env.outValue *= signal * amp;

  env.timeMs += sampleCountToMs;
}

export {
  stagesWAHDSR, // not yet used
  initEnvelope,
  processEnvelope
}