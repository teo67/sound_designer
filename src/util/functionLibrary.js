import Function from "../classes/Function.js";
class Argument {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

const getIndex = (context, _i) => {
    if(_i < 0 || _i >= context.current_s.length) {
        return 0;
    }
    if(_i < context.N || _i >= context.N + context.saved_s.length) {
        return context.current_s[_i];
    }
    return context.saved_s[_i - context.N];
}

const allFunctions = {
    "y": new Function("Get the y value of the mouse, ranging from -1 to 1.", [], context => context.y),
    "x": new Function("Get the x value of the mouse, ranging from -1 to 1.", [], context => context.x),
    "t": new Function("Get the time within the sample, in seconds.", [], context => context.t),
    "T": new Function("Get the starting time of the selected region, in seconds.", [], context => context.T),
    "n": new Function("Get the current sample index.", [], context => context.n),
    "N": new Function("Get the starting sample index of the selected region.", [], context => context.N),
    "s": new Function("Get the current value of the sample, from -1 to 1. If an argument is specified, get the value of that sample instead.", [
        new Argument("index", "The index of the sample to get.")
    ], (context, i = context.n) => getIndex(context, Math.round(i))),
    "abs": new Function("Get the absolute value of any number.", [
        new Argument("input", "A number")
    ], (_, input = 0) => Math.abs(input)),
    "osc": new Function("Make an oscillation with a given frequency.", [
        new Argument("frequency", "The frequency of the oscillation, in Hz.")
    ], (context, freq) => Math.sin(context.t * freq * 2 * Math.PI)),
    "sin": new Function("Get the sine of a value, in radians.", [
        new Argument("angle", "An angle, in radians.")
    ], (_, ang) => Math.sin(ang)),
    "cos": new Function("Get the cosine of a value, in radians.", [
        new Argument("angle", "An angle, in radians.")
    ], (_, ang) => Math.cos(ang)),
    "tan": new Function("Get the tangent of a value, in radians.", [
        new Argument("angle", "An angle, in radians.")
    ], (_, ang) => Math.tan(ang)),
    "noise": new Function("Generate random noise in a given range.", [
        new Argument("max_mag", "The maximum magnitude of the noise (default: 0.1).")
    ], (_, maxmag = 0.1) => (Math.random() - 0.5) * 2 * maxmag),
    "log": new Function("Take the logarithm of a number with a given base.", [
        new Argument("value", "The number to take the log of."),
        new Argument("base", "The base of the logarithm (default: e).")
    ], (_, value, base = Math.E) => Math.log(value)/Math.log(base))
}

const makeToneFunction = (name, freq) => {
    allFunctions[name] = new Function(`Get the frequency of ${name}, in hz.`, [], () => freq);
}

makeToneFunction("C0", 16.35);
makeToneFunction("C#0", 17.32);
makeToneFunction("Db0", 17.32);
makeToneFunction("D0", 18.35);
makeToneFunction("D#0", 19.45);
makeToneFunction("Eb0", 19.45);
makeToneFunction("E0", 20.60);
makeToneFunction("F0", 21.83);
makeToneFunction("F#0", 23.12);
makeToneFunction("Gb0", 23.12);
makeToneFunction("G0", 24.50);
makeToneFunction("G#0", 25.96);
makeToneFunction("Ab0", 25.96);
makeToneFunction("A0", 27.50);
makeToneFunction("A#0", 29.14);
makeToneFunction("Bb0", 29.14);
makeToneFunction("B0", 30.87);
makeToneFunction("C1", 32.70);
makeToneFunction("C#1", 34.65);
makeToneFunction("Db1", 34.65);
makeToneFunction("D1", 36.71);
makeToneFunction("D#1", 38.89);
makeToneFunction("Eb1", 38.89);
makeToneFunction("E1", 41.20);
makeToneFunction("F1", 43.65);
makeToneFunction("F#1", 46.25);
makeToneFunction("Gb1", 46.25);
makeToneFunction("G1", 49.00);
makeToneFunction("G#1", 51.91);
makeToneFunction("Ab1", 51.91);
makeToneFunction("A1", 55.00);
makeToneFunction("A#1", 58.27);
makeToneFunction("Bb1", 58.27);
makeToneFunction("B1", 61.74);
makeToneFunction("C2", 65.41);
makeToneFunction("C#2", 69.30);
makeToneFunction("Db2", 69.30);
makeToneFunction("D2", 73.42);
makeToneFunction("D#2", 77.78);
makeToneFunction("Eb2", 77.78);
makeToneFunction("E2", 82.41);
makeToneFunction("F2", 87.31);
makeToneFunction("F#2", 92.50);
makeToneFunction("Gb2", 92.50);
makeToneFunction("G2", 98.00);
makeToneFunction("G#2", 103.83);
makeToneFunction("Ab2", 103.83);
makeToneFunction("A2", 110.00);
makeToneFunction("A#2", 116.54);
makeToneFunction("Bb2", 116.54);
makeToneFunction("B2", 123.47);
makeToneFunction("C3", 130.81);
makeToneFunction("C#3", 138.59);
makeToneFunction("Db3", 138.59);
makeToneFunction("D3", 146.83);
makeToneFunction("D#3", 155.56);
makeToneFunction("Eb3", 155.56);
makeToneFunction("E3", 164.81);
makeToneFunction("F3", 174.61);
makeToneFunction("F#3", 185.00);
makeToneFunction("Gb3", 185.00);
makeToneFunction("G3", 196.00);
makeToneFunction("G#3", 207.65);
makeToneFunction("Ab3", 207.65);
makeToneFunction("A3", 220.00);
makeToneFunction("A#3", 233.08);
makeToneFunction("Bb3", 233.08);
makeToneFunction("B3", 246.94);
makeToneFunction("C4", 261.63);
makeToneFunction("C#4", 277.18);
makeToneFunction("Db4", 277.18);
makeToneFunction("D4", 293.66);
makeToneFunction("D#4", 311.13);
makeToneFunction("Eb4", 311.13);
makeToneFunction("E4", 329.63);
makeToneFunction("F4", 349.23);
makeToneFunction("F#4", 369.99);
makeToneFunction("Gb4", 369.99);
makeToneFunction("G4", 392.00);
makeToneFunction("G#4", 415.30);
makeToneFunction("Ab4", 415.30);
makeToneFunction("A4", 440.00);
makeToneFunction("A#4", 466.16);
makeToneFunction("Bb4", 466.16);
makeToneFunction("B4", 493.88);
makeToneFunction("C5", 523.25);
makeToneFunction("C#5", 554.37);
makeToneFunction("Db5", 554.37);
makeToneFunction("D5", 587.33);
makeToneFunction("D#5", 622.25);
makeToneFunction("Eb5", 622.25);
makeToneFunction("E5", 659.25);
makeToneFunction("F5", 698.46);
makeToneFunction("F#5", 739.99);
makeToneFunction("Gb5", 739.99);
makeToneFunction("G5", 783.99);
makeToneFunction("G#5", 830.61);
makeToneFunction("Ab5", 830.61);
makeToneFunction("A5", 880.00);
makeToneFunction("A#5", 932.33);
makeToneFunction("Bb5", 932.33);
makeToneFunction("B5", 987.77);
makeToneFunction("C6", 1046.50);
makeToneFunction("C#6", 1108.73);
makeToneFunction("Db6", 1108.73);
makeToneFunction("D6", 1174.66);
makeToneFunction("D#6", 1244.51);
makeToneFunction("Eb6", 1244.51);
makeToneFunction("E6", 1318.51);
makeToneFunction("F6", 1396.91);
makeToneFunction("F#6", 1479.98);
makeToneFunction("Gb6", 1479.98);
makeToneFunction("G6", 1567.98);
makeToneFunction("G#6", 1661.22);
makeToneFunction("Ab6", 1661.22);
makeToneFunction("A6", 1760.00);
makeToneFunction("A#6", 1864.66);
makeToneFunction("Bb6", 1864.66);
makeToneFunction("B6", 1975.53);
makeToneFunction("C7", 2093.00);
makeToneFunction("C#7", 2217.46);
makeToneFunction("Db7", 2217.46);
makeToneFunction("D7", 2349.32);
makeToneFunction("D#7", 2489.02);
makeToneFunction("Eb7", 2489.02);
makeToneFunction("E7", 2637.02);
makeToneFunction("F7", 2793.83);
makeToneFunction("F#7", 2959.96);
makeToneFunction("Gb7", 2959.96);
makeToneFunction("G7", 3135.96);
makeToneFunction("G#7", 3322.44);
makeToneFunction("Ab7", 3322.44);
makeToneFunction("A7", 3520.00);
makeToneFunction("A#7", 3729.31);
makeToneFunction("Bb7", 3729.31);
makeToneFunction("B7", 3951.07);
makeToneFunction("C8", 4186.01);
makeToneFunction("C#8", 4434.92);
makeToneFunction("Db8", 4434.92);
makeToneFunction("D8", 4698.63);
makeToneFunction("D#8", 4978.03);
makeToneFunction("Eb8", 4978.03);
makeToneFunction("E8", 5274.04);
makeToneFunction("F8", 5587.65);
makeToneFunction("F#8", 5919.91);
makeToneFunction("Gb8", 5919.91);
makeToneFunction("G8", 6271.93);
makeToneFunction("G#8", 6644.88);
makeToneFunction("Ab8", 6644.88);
makeToneFunction("A8", 7040.00);
makeToneFunction("A#8", 7458.62);
makeToneFunction("Bb8", 7458.62);
makeToneFunction("B8", 7902.13);

export default allFunctions;