import Mode from './Mode.js';

class ContextMode extends Mode {
    constructor(stateMachine) {
        super();
        this.stateMachine = stateMachine;
    }
}

export default ContextMode;
