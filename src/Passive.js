import ContextMode from './ContextMode.js';
import Selecting from './Selecting.js';
import Selected from './Selected.js';
class Passive extends ContextMode {
    constructor(stateMachine, cursor) {
        super(stateMachine);
        this.cursor = cursor;
        this.cursorTarget = 0;
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
        }
    }
}

export default Passive;