import StateMachine from './src/classes/StateMachine.js';
import Passive from './src/modes/Passive.js';
import constants from './src/util/constants.js';
const button = document.getElementById("but");
const cursor = document.getElementById("cursor-line");
const scroller = document.getElementById("scroller");
const zoomer = document.getElementById("zoomer");
const selectable = document.getElementById("selectable");

const initialSampleRate = constants.minSampleRate;
const initialDuration = 1;

const stateMachine = new StateMachine(initialSampleRate, initialDuration);

document.addEventListener('click', ev => {
    if(selectable.contains(ev.target)) {
        stateMachine.currentState.onClick(ev);
    }
});

scroller.onmousedown = ev => stateMachine.context.onScrollerDown(ev);
zoomer.onmousedown = ev => stateMachine.context.onZoomerDown(ev);
addEventListener('mousemove', ev => stateMachine.context.onMouseMove(ev));
addEventListener('mouseup', ev => stateMachine.context.onMouseUp(ev));

addEventListener('keydown', ev => stateMachine.currentState.onKeyDown(ev));
addEventListener('mousemove', ev => stateMachine.currentState.onMouseMove(ev));
addEventListener('resize', ev => stateMachine.context.onResize(ev));
stateMachine.enterState(new Passive(stateMachine, cursor));

button.onclick = () => stateMachine.playSound();