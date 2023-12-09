class Argument {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}
class Function {
    constructor(description, args, fun) {
        this.description = description;
        this.args = args;
        this.fun = fun;
    }
    makeCallTo(args) {
        return context => this.fun(context, ...args.map(arg => arg(context)));
    }
}
const allFunctions = {
    "y": new Function("Get the y value of the mouse, ranging from -1 to 1.", [], context => context.y),
    "x": new Function("Get the x value of the mouse, ranging from -1 to 1.", [], context => context.x),
    "t": new Function("Get the time within the sample, in seconds.", [], context => context.t),
    "s": new Function("Get the current value of the sample, from -1 to 1.", [], context => context.s),
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
export default allFunctions;