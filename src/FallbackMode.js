import ContextMode from './ContextMode.js';

class FallbackMode extends ContextMode {
    constructor(stateMachine, fallback) {
        super(stateMachine);
        this.fallback = fallback;
    }
    enterFallback() {
        this.stateMachine.enterState(this.fallback, true);
    }
    fullFallback() {
        this.enterFallback();
        if(this.fallback instanceof FallbackMode) {
            this.fallback.fullFallback();
        }
    }
    detectEscape(ev) {
        if(ev.key == 'Escape') {
            this.enterFallback();
        }
    }
}

export default FallbackMode;
