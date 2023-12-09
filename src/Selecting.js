import FallbackMode from './FallbackMode.js';
import Selected from './Selected.js';

class Selecting extends FallbackMode {
    constructor(stateMachine, fallback, cursorTarget) {
        super(stateMachine, fallback);
        this.cursorTarget = cursorTarget;
        this.previousLeftBound = cursorTarget;
        this.previousRightBound = cursorTarget;
    }
    enter() {}
    onMouseMove(event) {
        const bound = this.stateMachine.context.getSampleFromX(event.clientX);
        const left = Math.min(this.cursorTarget, bound);
        const right = Math.max(this.cursorTarget, bound);
        this.changeClassOfElements(this.previousLeftBound, left, [], ['selected']);
        this.changeClassOfElements(left, this.previousLeftBound, ['selected'], []);
        this.changeClassOfElements(this.previousRightBound, right, ['selected'], []);
        this.changeClassOfElements(right, this.previousRightBound, [], ['selected']);
        this.previousLeftBound = left;
        this.previousRightBound = right;
    }
    onClick() {
        this.stateMachine.enterState(new Selected(this.stateMachine, this, this.previousLeftBound, this.previousRightBound));
    }
    onKeyDown(event) {
        this.detectEscape(event);
    }
    cancel() {
        this.changeClassOfElements(this.previousLeftBound, this.previousRightBound, [], ['selected']);
    }
}

export default Selecting;