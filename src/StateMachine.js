import None from './None.js';
class StateMachine {
    constructor(context) {
        this.currentState = new None();
        this.currentState.enter();
        this.context = context;
    }
    enterState(state, cancel = false) {
        if(cancel) {
            this.currentState.cancel();
        } else {
            this.currentState.succeed();
        }
        this.currentState = state;
        state.enter();
    }
}
export default StateMachine;