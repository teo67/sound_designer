import FallbackMode from "./FallbackMode.js";

const selectingStuff = document.getElementById("selecting-stuff");

class SelectingStuffNode extends FallbackMode {
    constructor(stateMachine, fallback, classname) {
        super(stateMachine, fallback);
        this.classname = classname;
        this.el = null;
        this.left = 0;
        this.right = 0;
    }
    enter() {
        if(this.el == null) {
            this.el = document.createElement("div");
            this.el.classList.add(this.classname);
            
            selectingStuff.appendChild(this.el);
        }
        this.updateSelectorVisuals();
    }
    cancel() {
        this.el.remove();
    }
    onScroll() {
        this.updateSelectorVisuals();
    }
    onScale() {
        this.updateSelectorVisuals();
    }
    updateSelectorVisuals() {
        const leftX = this.stateMachine.context.getXFromSample(this.left);
        const rightX = this.stateMachine.context.getXFromSample(this.right);
        this.el.style.left = `${leftX}px`;
        this.el.style.width = `${rightX - leftX}px`;
    }
}

export default SelectingStuffNode;