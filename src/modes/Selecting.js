import SelectingStuffNode from '../classes/SelectingStuffNode.js';
import Selected from './Selected.js';

class Selecting extends SelectingStuffNode {
    constructor(stateMachine, fallback, cursorTarget) {
        super(stateMachine, fallback, "selecting");
        this.cursorTarget = cursorTarget;
        this.left = cursorTarget;
        this.right = cursorTarget;
    }
    onMouseMove(event) {
        const bound = this.stateMachine.context.getSampleFromX(event.clientX);
        this.left = Math.min(this.cursorTarget, bound);
        this.right = Math.max(this.cursorTarget, bound);
        this.updateSelectorVisuals(); 
    }
    onClick() {
        this.stateMachine.enterState(new Selected(this.stateMachine, this, this.left, this.right));
    }
    onKeyDown(event) {
        this.detectEscape(event);
        if(event.key == " ") {
            const start = this.left/this.stateMachine.sampleRate;
            this.stateMachine.playSound(start);
        }
    }
}

export default Selecting;