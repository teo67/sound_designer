import ContextMode from './ContextMode.js';
import Selecting from './Selecting.js';
import Selected from './Selected.js';
import ChangingSampleRate from './ChangingSampleRate.js';
import ChangingSoundLength from './ChangingSoundLength.js';
const changeSampleRate = document.getElementById("change-sample-rate");
const changeSoundLength = document.getElementById("change-sound-length");

class Passive extends ContextMode {
    constructor(stateMachine, cursor) {
        super(stateMachine);
        this.cursor = cursor;
        this.cursorTarget = 0;
    }
    enter() {
        changeSampleRate.onclick = () => this.enterSampleRate();
        changeSoundLength.onclick = () => this.enterSoundLength();
    }
    enterSoundLength() {
        this.stateMachine.enterState(new ChangingSoundLength(this.stateMachine, this));
    }
    enterSampleRate() {
        this.stateMachine.enterState(new ChangingSampleRate(this.stateMachine, this));
    }
    succeed() {
        changeSampleRate.onclick = () => {};
    }
    cancel() {
        changeSampleRate.onclick = () => {};
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
            this.stateMachine.enterState(new Selected(this.stateMachine, this, 0, this.stateMachine.context.samples.length));
        } else if(event.key == 'r') {
            this.enterSampleRate();
        } else if(event.key == 'l') {
            this.enterSoundLength();
        }
    }
}

export default Passive;