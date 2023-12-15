import InputCheckboxButton from "../classes/InputCheckboxButton.js";

class ChangingSoundLength extends InputCheckboxButton {
    constructor(stateMachine, fallback) {
        super(stateMachine, fallback, "change sound length");
    }

    addComponents() {
        this.soundLength = this.makeLabelAndInput("length (s)", "number", this.stateMachine.duration);
        this.soundLength.min = 0;
        this.soundLength.max = 45;
        this.changeSpeed = this.makeLabelAndInput("speed up / slow down", "checkbox", "");
    }

    onSubmit() {
        let samples = this.stateMachine.context.samples;
        let requestedDuration = this.soundLength.value;
        const numSamples = Math.floor(this.stateMachine.sampleRate * requestedDuration);
        requestedDuration = numSamples / this.stateMachine.sampleRate;
        if(!this.stateMachine.verifyRateAndDuration(this.stateMachine.sampleRate, requestedDuration, numSamples)) {
            this.displayError("invalid sample rate and/or duration!");
            return false;
        }
        if(this.changeSpeed.checked) { // resample
            const currentDuration = this.stateMachine.duration;
            samples = this.stateMachine.resample(numSamples, currentDuration/requestedDuration, samples);
        }
        this.stateMachine.updateDuration(requestedDuration, samples.slice(0, Math.min(samples.length, numSamples)));
        return true;
    }
}

export default ChangingSoundLength;