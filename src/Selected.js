import FallbackMode from './FallbackMode.js';
import Editing from './Editing.js';

class Selected extends FallbackMode {
    constructor(stateMachine, fallback, left, right) {
        super(stateMachine, fallback);
        this.left = left;
        this.right = right;
    }
    enter() {
        this.changeClassOfElements(this.left, this.right, ['really-selected'], []);
    }
    cancel() {
        this.changeClassOfElements(this.left, this.right, [], ['really-selected']);
    }
    onKeyDown(event) {
        event.preventDefault();
        this.detectEscape(event);
        if (event.key == 'q') {
            this.stateMachine.enterState(new Editing(this.stateMachine, this, this.left, this.right));
        }
    }
}

export default Selected;