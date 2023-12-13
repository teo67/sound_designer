import InputCheckboxButton from "./InputCheckboxButton.js";

class ChangingSampleRate extends InputCheckboxButton {
    constructor(stateMachine, fallback) {
        super(stateMachine, fallback, {
            text: "change sample rate",
            inputLabel: "rate (hz)",
            defaultValue: 3000,
            minInput: 3000,
            maxInput: 96000,
            checkboxLabel: "resample"
        });
    }

    onSubmit() {
        let samples = this.stateMachine.context.samples;
        const requestedRate = this.inputElement.value;
        const numSamples = this.stateMachine.duration * requestedRate;
        if(this.checkboxElement.checked) { // resample
            const currentRate = this.stateMachine.sampleRate;
            samples = this.stateMachine.resample(numSamples, currentRate/requestedRate);
        }
        this.stateMachine.updateSampleRate(requestedRate, samples.slice(0, Math.min(samples.length, numSamples)));
    }
}

export default ChangingSampleRate;