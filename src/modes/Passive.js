import ContextMode from '../classes/ContextMode.js';
import Selecting from './Selecting.js';
import Selected from './Selected.js';
import ChangingSampleRate from './ChangingSampleRate.js';
import ChangingSoundLength from './ChangingSoundLength.js';
import Importing from './Importing.js';
import Exporting from './Exporting.js';
const changeSampleRate = document.getElementById("change-sample-rate");
const changeSoundLength = document.getElementById("change-sound-length");
const importButton = document.getElementById("import");
const exportButton = document.getElementById("export");

const buttons = [changeSampleRate, changeSoundLength, importButton, exportButton];

class Passive extends ContextMode {
    constructor(stateMachine, cursor) {
        super(stateMachine);
        this.cursor = cursor;
        this.cursorTarget = 0;
    }
    enter() {
        changeSampleRate.onclick = () => this.enterSampleRate();
        changeSoundLength.onclick = () => this.enterSoundLength();
        importButton.onclick = () => this.enterImport();
        exportButton.onclick = () => this.enterExport();
        for(const button of buttons) {
            if(button.classList.contains('disabled')) {
                button.classList.remove('disabled');
            }
        }
    }
    enterSoundLength() {
        this.stateMachine.enterState(new ChangingSoundLength(this.stateMachine, this));
    }
    enterSampleRate() {
        this.stateMachine.enterState(new ChangingSampleRate(this.stateMachine, this));
    }
    enterImport() {
        this.stateMachine.enterState(new Importing(this.stateMachine, this));
    }
    enterExport() {
        this.stateMachine.enterState(new Exporting(this.stateMachine, this));
    }
    succeed() {
        for(const button of buttons) {
            button.onclick = () => {};
            button.classList.add('disabled');
        }
    }
    cancel() {
        this.succeed();
    }
    onMouseMove(event) {
        const sam = this.stateMachine.context.getSampleFromX(event.clientX);
        this.cursor.style.left = `${this.stateMachine.context.getXFromSample(sam)}px`;
        this.cursorTarget = sam;
    }
    onClick() {
        this.stateMachine.enterState(new Selecting(this.stateMachine, this, this.cursorTarget));
    }
    onKeyDown(event) {
        if(event.key == 'a') { // select all
            this.stateMachine.context.setScale(14, 100/this.stateMachine.context.samples.length);
            this.stateMachine.enterState(new Selected(this.stateMachine, this, 0, this.stateMachine.context.samples.length));
        } else if(event.key == 'r') {
            this.enterSampleRate();
        } else if(event.key == 'l') {
            this.enterSoundLength();
        } else if(event.key == 'i') {
            this.enterImport();
        } else if(event.key == 'e') {
            this.enterExport();
        }
    }
}

export default Passive;