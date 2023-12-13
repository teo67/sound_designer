import InputCheckboxButton from "./InputCheckboxButton.js";

class ChangingSoundLength extends InputCheckboxButton {
    constructor(stateMachine, fallback) {
        super(stateMachine, fallback, {
            text: "change sound length",
            inputLabel: "time (s)",
            defaultValue: 1,
            minInput: 0.1,
            maxInput: 45,
            checkboxLabel: "speed up/slow down"
        });
    }

    onSubmit() {
        let samples = this.stateMachine.context.samples;
        const requestedDuration = this.inputElement.value;
        const numSamples = this.stateMachine.sampleRate * requestedDuration;
        if(this.checkboxElement.checked) { // resample
            const currentDuration = this.stateMachine.duration;
            samples = this.stateMachine.resample(numSamples, currentDuration/requestedDuration);
        }
        this.stateMachine.updateDuration(requestedDuration, samples.slice(0, Math.min(samples.length, numSamples)));
    }
}

export default ChangingSoundLength;