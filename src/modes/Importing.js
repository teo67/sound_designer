import InputCheckboxButton from "../classes/InputCheckboxButton.js";
import constants from "../util/constants.js";
import verifyVariable from "../util/verifyVariable.js";

class Importing extends InputCheckboxButton {
    constructor(stateMachine, fallback) {
        super(stateMachine, fallback, "import options");
        this.file = null;
        this.sampleRate = null;
        this.soundLength = null;
    }

    async loadSound(path) {
        const fileReader = new FileReader();
        const blankContext = new AudioContext();
        const prom = new Promise(res => {
            fileReader.onload = ev => {
                const buffer = ev.target.result;
                blankContext.decodeAudioData(buffer, res);
            }
        });
        fileReader.readAsArrayBuffer(path);
        return prom;
    }

    addComponents() {
        this.file = this.makeLabelAndInput("upload file", "file", "");
        this.sampleRate = this.makeLabelAndInput("defer to new sample rate", "checkbox", "");
        this.soundLength = this.makeLabelAndInput("increase sound length if needed", "checkbox", "");
        this.variableName = this.makeLabelAndInput("bind to", "text", "i");
    }

    async onSubmit() {
        const varName = this.variableName.value;
        if(!verifyVariable(varName)) {
            this.displayError("invalid variable name!");
            return false;
        }
        if(this.file.files.length < 1) {
            this.displayError("no file selected!");
            return false;
        }
        const filename = this.file.files[0];
        const res = await this.loadSound(filename);
        const samples = res.getChannelData(0);
        const sampleRate = res.sampleRate;
        const duration = res.duration;
        let theoreticalTotalDuration = this.stateMachine.duration;
        if(this.soundLength.checked) {
            theoreticalTotalDuration = Math.max(theoreticalTotalDuration, duration);
        }
        let theoreticalSampleRate = this.stateMachine.sampleRate;
        if(this.sampleRate.checked) {
            theoreticalSampleRate = Math.min(constants.maxSampleRate, Math.max(constants.minSampleRate, sampleRate));
        }
        const totalSamples = Math.floor(theoreticalTotalDuration * theoreticalSampleRate);
        theoreticalTotalDuration = totalSamples / theoreticalSampleRate;
        if(!this.stateMachine.verifyRateAndDuration(theoreticalSampleRate, theoreticalTotalDuration, totalSamples)) {
            this.displayError("invalid sample rate and/or duration!");
            return false;
        }
        
        const newSam = this.stateMachine.resample(totalSamples, this.stateMachine.sampleRate/theoreticalSampleRate, this.stateMachine.context.samples);
        const importedSam = this.stateMachine.resample(totalSamples, sampleRate/theoreticalSampleRate, samples);
        this.stateMachine.sampleRate = theoreticalSampleRate;
        this.stateMachine.duration = theoreticalTotalDuration;
        this.stateMachine.regen(newSam);
        this.stateMachine.bindings[varName] = importedSam;
        return true;
    }
}

export default Importing;