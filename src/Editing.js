import FallbackMode from "./FallbackMode.js";
const editor = document.getElementById("edit-interface");
import Parser from "./Parser.js";
import allFunctions from "./functionLibrary.js";

class Function {
    constructor(name, element) {
        this.name = name;
        this.element = element;
    }
}

class Editing extends FallbackMode {
    constructor(stateMachine, fallback, left, right) {
        super(stateMachine, fallback);
        this.left = left;
        this.right = right;
        this.element = null;
        this.label = null;
        this.formula = null;
        this.funLibrary = null;
        this.formulaContext = {
            'x': 0,
            'y': 0,
            't': 0,
            's': 0
        };
        this.functions = [];
    }
    getPriority(a, key) {
        if(a.startsWith(key)) {
            return 1-1/a.length;
        }
        if(a.includes(key)) {
            return 2-1/a.length;
        }
        return 2;
    }
    updateFormula() {
        const parser = new Parser(this.element.value);
        try {
            const newForm = parser.parse();
            this.formula = newForm;
        } catch {} finally {
            const key = parser.lastFun;
            this.sortFunLibrary((a, b) => this.getPriority(a.name, key) - this.getPriority(b.name, key));
        }
        this.updateDisplay();
    }
    eval() {
        return Math.min(1, Math.max(-1, this.formula(this.formulaContext)));
    }
    updateDisplay(realUpdate = false) {
        this.formulaContext.t = 0;
        // for(let i = this.left; i < this.right; i++) {
        //     this.formulaContext.s = this.stateMachine.context.samples[i];
        //     const eval1 = this.eval();
        //     this.stateMachine.context.displayElementValue(i, eval1);
        //     if(realUpdate) {
        //         this.stateMachine.context.setElementValue(i, eval1);
        //     }
        //     this.formulaContext.t += 1 / this.stateMachine.context.sampleRate;
        // }
    }
    enter() {
        this.label = document.createElement("label");
        this.label.htmlFor = 'formula';
        this.label.innerText = 'Enter formula:';
        this.element = document.createElement("input");
        this.element.type = "text";
        this.element.name = 'formula';
        this.element.value = 's';
        
        editor.appendChild(this.label);
        editor.appendChild(this.element);
        editor.classList.remove("hidden");
        this.element.addEventListener('keydown', () => this.updateFormula);
        this.element.addEventListener('paste', () => this.updateFormula());
        this.element.addEventListener('input', () => this.updateFormula());
        this.updateFormula();
        this.element.focus();

        this.makeFunLibrary();
    }
    sortFunLibrary(key) {
        if(this.funLibrary == null) {
            return;
        }
        this.functions.sort(key);
        while(this.funLibrary.firstChild) {
            this.funLibrary.removeChild(this.funLibrary.firstChild);
        }
        for(const item of this.functions) {
            this.funLibrary.appendChild(item.element);
        }
    }
    makeFunLibrary() {
        this.functions = [];
        this.funLibrary = document.createElement("section");
        this.funLibrary.classList.add("function-library");

        for(const fun in allFunctions) {
            const funEl = document.createElement("div");
            funEl.classList.add("function");
            const title = document.createElement("p");
            title.classList.add("title");
            title.innerText = fun;
            const description = document.createElement("p");
            description.classList.add("description");
            description.innerText = allFunctions[fun].description;
            const args = document.createElement("div");
            funEl.appendChild(title);
            funEl.appendChild(description);
            if(allFunctions[fun].args.length > 0) {
                args.classList.add("args");
                args.innerText = "Arguments";
                for(const arg of allFunctions[fun].args) {
                    const argEl = document.createElement("div");
                    argEl.classList.add("arg");
                    const argTitle = document.createElement("p");
                    argTitle.classList.add("arg-title");
                    argTitle.innerText = arg.name;
                    const argDescription = document.createElement("p");
                    argDescription.classList.add("arg-description");
                    argDescription.innerText = arg.description;
                    argEl.appendChild(argTitle);
                    argEl.appendChild(argDescription);
                    args.appendChild(argEl);
                }
                funEl.appendChild(args);
            }
            this.funLibrary.appendChild(funEl);
            this.functions.push(new Function(fun, funEl));
        }

        editor.appendChild(this.funLibrary);
    }
    onMouseMove(event) {
        this.formulaContext.y = (event.clientY / this.stateMachine.context.docHeight) * -2 + 1;
        this.formulaContext.x = (event.clientX / this.stateMachine.context.docWidth) * 2 - 1;
        this.updateDisplay();
    }
    onKeyDown(event) {
        this.detectEscape(event);
        if(event.key == 'Enter') {
            this.updateDisplay(true);
            this.fullFallback();
        }
    }
    destroyElements() {
        this.label.remove();
        this.element.remove();
        this.funLibrary.remove();
    }
    cancel() {
        this.destroyElements();
        for(let i = this.left; i < this.right; i++) {
            this.stateMachine.context.displayElementValue(i, this.stateMachine.context.samples[i]);
        }
    }
    succeed() {
        this.destroyElements();
    }
}

export default Editing;