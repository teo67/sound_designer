import StateMachine from './src/StateMachine.js';
import Context from './src/Context.js';
import Passive from './src/Passive.js';
const button = document.getElementById("but");
const samplesHolder = document.getElementById("samples");
const cursor = document.getElementById("cursor-line");
const scroller = document.getElementById("scroller");
const scrollview = document.getElementById("scrollview");
const zoomer = document.getElementById("zoomer");
const zoomview = document.getElementById("zoomview");

const sampleRate = 3000;
const seconds = 1;


const audioCtx = new AudioContext({
    sampleRate: sampleRate,
});
const myArrayBuffer = audioCtx.createBuffer(
  1,
  audioCtx.sampleRate * seconds,
  audioCtx.sampleRate,
);

const monoChannel = myArrayBuffer.getChannelData(0);

const context = new Context(monoChannel, samplesHolder, sampleRate, scrollview, zoomview);
context.initialize();
const stateMachine = new StateMachine(context);

scroller.ondrag = ev => console.log(ev);

samplesHolder.onclick = ev => stateMachine.currentState.onClick(ev);
cursor.onclick = ev => stateMachine.currentState.onClick(ev);

scroller.onmousedown = ev => context.onScrollerDown(ev);
zoomer.onmousedown = ev => context.onZoomerDown(ev);
addEventListener('mousemove', ev => context.onMouseMove(ev));
addEventListener('mouseup', ev => context.onMouseUp(ev));

addEventListener('keydown', ev => stateMachine.currentState.onKeyDown(ev));
addEventListener('mousemove', ev => stateMachine.currentState.onMouseMove(ev));
addEventListener('resize', ev => context.onResize(ev));
stateMachine.enterState(new Passive(stateMachine, cursor));

button.onclick = () => {
  const source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;
  source.connect(audioCtx.destination);
  source.start();
}