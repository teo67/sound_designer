import Mode from './Mode.js';

class ContextMode extends Mode {
    constructor(stateMachine) {
        super();
        this.stateMachine = stateMachine;
    }
    getElement(i) {
        return this.stateMachine.context.getElement(i);
    }
    changeClassOfElements(a, b, adding, removing) {
        for(let i = a; i < b; i++) {
            const el = this.getElement(i);
            for(const cl of adding) {
                el.classList.add(cl);
            }
            for(const cl of removing) {
                el.classList.remove(cl);
            }
        }
    }
}

export default ContextMode;
