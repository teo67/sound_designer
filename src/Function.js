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

export default Function;