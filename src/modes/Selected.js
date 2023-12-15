import SelectingStuffNode from '../classes/SelectingStuffNode.js';
import Editing from './Editing.js';
import verifyVariable from '../util/verifyVariable.js';

const copyInput = document.getElementById("copy-input");
const copyButton = document.getElementById("copy");

class Selected extends SelectingStuffNode {
    constructor(stateMachine, fallback, left, right) {
        super(stateMachine, fallback, "selected");
        this.left = left;
        this.right = right;
    }
    enter() {
        super.enter();
        copyButton.onclick = () => this.copy();
        if(copyButton.classList.contains('disabled')) {
            copyButton.classList.remove('disabled');
        }
    }
    noCopy() {
        copyButton.onclick = () => {};
        copyButton.classList.add('disabled');
    }
    succeed() {
        super.succeed();
        this.noCopy();
    }
    cancel() {
        super.cancel();
        this.noCopy();
    }
    displayMessage(text) {
        const newEl = document.createElement("p");
        newEl.innerText = text;
        copyButton.appendChild(newEl);
        setTimeout(() => {
            copyButton.removeChild(newEl);
        }, 1000);
    }
    copy() {
        if(document.activeElement == copyInput) {
            return;
        }
        const bindingName = copyInput.value;
        if(!verifyVariable(bindingName)) {
            this.displayMessage("[failed: invalid binding name]");
            return;
        }
        this.stateMachine.bindings[bindingName] = this.stateMachine.context.samples.slice(this.left, this.right);
        this.displayMessage("[copied!]");
    }
    onKeyDown(event) {
        if(document.activeElement == copyInput) {
            return;
        }
        event.preventDefault();
        this.detectEscape(event);
        if(event.key == 'q') {
            this.stateMachine.enterState(new Editing(this.stateMachine, this, this.left, this.right));
        } else if(event.key == ' ') {
            const start = this.left/this.stateMachine.sampleRate;
            const end = this.right/this.stateMachine.sampleRate;
            this.stateMachine.playSound(start, end - start);
        } else if(event.key == 'c') {
            this.copy();
        }
    }
}

export default Selected;