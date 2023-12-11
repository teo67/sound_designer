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
            throw "Too many samples!"
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