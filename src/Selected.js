import SelectingStuffNode from './SelectingStuffNode.js';
import Editing from './Editing.js';

class Selected extends SelectingStuffNode {
    constructor(stateMachine, fallback, left, right) {
        super(stateMachine, fallback, "selected");
        this.left = left;
        this.right = right;
    }
    onKeyDown(event) {
        event.preventDefault();
        this.detectEscape(event);
        if(event.key == 'q') {
            this.stateMachine.enterState(new Editing(this.stateMachine, this, this.left, this.right));
        }
    }
}

export default Selected;