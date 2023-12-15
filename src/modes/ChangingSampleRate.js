import InputCheckboxButton from "../classes/InputCheckboxButton.js";
import constants from "../util/constants.js";

class ChangingSampleRate extends InputCheckboxButton {
    constructor(stateMachine, fallback) {
        super(stateMachine, fallback, "change sample rate");
        this.sampleRate = null;
        this.resample = null;
    }

    addComponents() {
        this.sampleRate = this.makeLabelAndInput("rate (1/s)", "number", this.stateMachine.sampleRate);
        this.sampleRate.min = constants.minSampleRate;
        this.sampleRate.max = constants.maxSampleRate;
        this.resample = this.makeLabelAndInput("resample", "checkbox", "");
    }

    onSubmit() {
        let samples = this.stateMachine.context.samples;
        const requestedRate = Math.round(this.sampleRate.value);
        const numSamples = Math.floor(this.stateMachine.duration * requestedRate);
        if(!this.stateMachine.verifyRateAndDuration(requestedRate, numSamples/requestedRate, numSamples)) {
            this.displayError("invalid sample rate and/or duration!");
            return false;
        }
        this.stateMachine.duration = numSamples / requestedRate;
        if(this.resample.checked) { // resample
            const currentRate = this.stateMachine.sampleRate;
            samples = this.stateMachine.resample(numSamples, currentRate/requestedRate, samples);
        }
        this.stateMachine.updateSampleRate(requestedRate, samples.slice(0, Math.min(samples.length, numSamples)));
        return true;
    }
}

export default ChangingSampleRate;