import ContextMode from './ContextMode.js';

class FallbackMode extends ContextMode {
    constructor(stateMachine, fallback) {
        super(stateMachine);
        this.fallback = fallback;
    }
    enterFallback(cancel = true) {
        this.stateMachine.enterState(this.fallback, cancel);
    }
    fullFallback(cancel = true) {
        this.enterFallback(cancel);
        if(this.fallback instanceof FallbackMode) {
            this.fallback.fullFallback(true);
        }
    }
    detectEscape(ev) {
        if(ev.key == 'Escape') {
            this.enterFallback();
        }
    }
}

export default FallbackMode;
