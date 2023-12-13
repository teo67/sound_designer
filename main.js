import StateMachine from './src/StateMachine.js';
import Passive from './src/Passive.js';
const button = document.getElementById("but");
const samplesHolder = document.getElementById("samples");
const cursor = document.getElementById("cursor-line");
const scroller = document.getElementById("scroller");
const zoomer = document.getElementById("zoomer");

const initialSampleRate = 6000;
const initialDuration = 1;

const stateMachine = new StateMachine(initialSampleRate, initialDuration);

samplesHolder.onclick = ev => stateMachine.currentState.onClick(ev);
cursor.onclick = ev => stateMachine.currentState.onClick(ev);

scroller.onmousedown = ev => stateMachine.context.onScrollerDown(ev);
zoomer.onmousedown = ev => stateMachine.context.onZoomerDown(ev);
addEventListener('mousemove', ev => stateMachine.context.onMouseMove(ev));
addEventListener('mouseup', ev => stateMachine.context.onMouseUp(ev));

addEventListener('keydown', ev => stateMachine.currentState.onKeyDown(ev));
addEventListener('mousemove', ev => stateMachine.currentState.onMouseMove(ev));
addEventListener('resize', ev => stateMachine.context.onResize(ev));
stateMachine.enterState(new Passive(stateMachine, cursor));

button.onclick = () => stateMachine.playSound();