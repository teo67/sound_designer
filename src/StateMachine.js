import None from './None.js';
import Context from './Context.js';

class StateMachine {
    constructor(sampleRate, duration) {
        this.currentState = new None();
        this.currentState.enter();
        this.sampleRate = sampleRate;
        this.duration = duration;
        this.context = null;
        this.actualContext = null;
        this.actualBuffer = null;
        this.regen([]);
    }

    resample(numSamples, ratio) {
        const samples = [];
        let currentSample = 0;
        let previousResult = 0;
        for(let i = 0; i < numSamples; i++) {
            let sum = 0;
            let num = 0;
            while(currentSample < (i + 1) * ratio) {
                sum += this.context.samples[currentSample];
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

    playSound() {
        const source = this.actualContext.createBufferSource();
        source.buffer = this.actualBuffer;
        source.connect(this.actualContext.destination);
        source.start();
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