import None from '../modes/None.js';
import Context from './Context.js';
import constants from '../util/constants.js';

class StateMachine {
    constructor(sampleRate, duration) {
        this.currentState = new None();
        this.currentState.enter();
        this.sampleRate = Math.round(sampleRate);
        this.duration = Math.floor(duration * this.sampleRate) / this.sampleRate;
        if(!this.verifyRateAndDuration(this.sampleRate, this.duration, this.sampleRate*this.duration)) {
            throw "Invalid initial conditions!";
        }
        this.context = null;
        this.actualContext = null;
        this.actualBuffer = null;
        this.bindings = {};
        this.regen([]);
    }

    verifyRateAndDuration(sampleRate, duration, frames) {
        if(sampleRate < constants.minSampleRate || sampleRate > constants.maxSampleRate) {
            return false;
        }
        if(duration < constants.minDuration || duration > constants.maxDuration) {
            return false;
        }
        if(frames < 1) {
            return false;
        }
        return true;
    }

    resample(numSamples, ratio, _samples) {
        const samples = [];
        let currentSample = 0;
        let previousResult = 0;
        for(let i = 0; i < numSamples; i++) {
            let sum = 0;
            let num = 0;
            while(currentSample < (i + 1) * ratio) {
                sum += currentSample >= _samples.length ? 0 : _samples[currentSample];
                currentSample++;
                num++;
            }
            if(num == 0) {
                samples.push(previousResult);
            } else {
                samples.push(sum/num);
                previousResult = sum/num;
            }
        }
        return samples;
    }

    regen(samples) {
        this.actualContext = new AudioContext({
            sampleRate: this.sampleRate
        });
        this.actualBuffer = this.actualContext.createBuffer(
          1,
          this.sampleRate * this.duration,
          this.sampleRate,
        );
        const channel = this.actualBuffer.getChannelData(0);
        if(samples.length > channel.length) {
            throw `Too many samples! (${samples.length})`;
        }
        for(let i = 0; i < samples.length; i++) {
            channel[i] = samples[i];
        }
        this.context = new Context(channel, this.sampleRate, this);
        this.context.initialize();
    }

    updateDuration(newDuration, samples) {
        this.duration = newDuration;
        this.regen(samples);
    }

    updateSampleRate(newRate, samples) {
        this.sampleRate = newRate;
        this.regen(samples);
    }

    playSound(start = undefined, duration = undefined) {
        const source = this.actualContext.createBufferSource();
        source.buffer = this.actualBuffer;
        source.connect(this.actualContext.destination);
        source.start(0, start, duration);
    }

    enterState(state, cancel = false) {
        if(cancel) {
            this.currentState.cancel();
        } else {
            this.currentState.succeed();
        }
        this.currentState = state;
        state.enter();
    }
}
export default StateMachine;