import FallbackMode from "../classes/FallbackMode.js";
import Parser from "../classes/Parser.js";
import allFunctions from "../util/functionLibrary.js";
const editor = document.getElementById("edit-interface");
const controlsBottom = document.getElementById("controls-bottom");

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
        this.formula = null;
        this.funLibrary = null;
        this.bindingsElement = null;
        this.toggleLibraries = null;
        this.formulaContext = {};
        this.functions = [];
        this.bindings = [];
        this.savedSamples = [];
        this.showing = false;
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
            const newForm = parser.parse(this.stateMachine.bindings);
            this.formula = newForm;
        } catch {} finally {
            const key = parser.lastFun;
            const keyFun = (a, b) => this.getPriority(a.name, key) - this.getPriority(b.name, key);
            this.sortLibrary(keyFun, this.functions, this.funLibrary);
            this.sortLibrary(keyFun, this.bindings, this.bindingsElement);
        }
        this.updateDisplay();
    }
    eval() {
        return Math.min(1, Math.max(-1, this.formula(this.formulaContext)));
    }
    updateDisplay(realUpdate = false) {
        this.formulaContext.t = this.formulaContext.T;
        this.formulaContext.n = this.formulaContext.N;
        for(let i = this.left; i < this.right; i++) {
            this.stateMachine.context.setSampleValue(i, this.eval());
            this.formulaContext.t += 1 / this.stateMachine.sampleRate;
            this.formulaContext.n++;
        }
        if(realUpdate) {
            for(const i in this.stateMachine.context.sampleElements) {
                this.stateMachine.context.updateElementValue(i);
            }
        } else {
            const min = Math.floor(this.left/this.stateMachine.context.samplesPerElement);
            const max = Math.ceil(this.right/this.stateMachine.context.samplesPerElement);
            for(let i = min; i < max; i++) {
                if(this.stateMachine.context.sampleElements[i] !== undefined) {
                    this.stateMachine.context.updateElementValue(i);
                }
            }
        }
    }
    enter() {
        controlsBottom.classList.add("hidden");

        this.element = document.createElement("input");
        this.element.type = "text";
        this.element.name = 'formula';
        this.element.value = 's';
        this.element.id = 'formula';
        this.savedSamples = this.stateMachine.context.samples.slice(this.left, this.right);
        
        this.formulaContext = {
            'x': 0,
            'y': 0,
            't': 0,
            'T': this.left / this.stateMachine.sampleRate,
            'current_s': this.stateMachine.context.samples,
            'saved_s': this.savedSamples,
            'n': 0,
            'N': this.left
        };

        editor.appendChild(this.element);
        editor.classList.remove("hidden");
        this.element.addEventListener('keydown', () => this.updateFormula);
        this.element.addEventListener('paste', () => this.updateFormula());
        this.element.addEventListener('input', () => this.updateFormula());
        this.updateFormula();
        this.element.focus();

        this.makeFunLibrary();  
        this.makeBindingsLibrary();
        this.toggleLibraries = document.createElement("div");
        this.toggleLibraries.classList.add("toggle-libraries");
        this.toggleLibraries.innerText = "show libraries";
        this.showing = false;
        this.toggleLibraries.onclick = () => {
            this.showing = !this.showing;
            this.toggleLibraries.innerText = this.showing ? "hide libraries" : "show libraries";
            if(this.showing) {
                this.show(this.funLibrary);
                this.show(this.bindingsElement);
            } else {
                this.hide(this.funLibrary);
                this.hide(this.bindingsElement);
            }
        }
        editor.appendChild(this.toggleLibraries);
    }
    hide(el) {
        if(el != null) {
            el.classList.add("hidden");
        }
    }
    show(el) {
        if(el != null && el.classList.contains("hidden")) {
            el.classList.remove("hidden");
        }
    }
    sortLibrary(key, arr, element) {
        if(element == null) {
            return;
        }
        arr.sort(key);
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
        for(const item of arr) {
            element.appendChild(item.element);
        }
    }
    noMoreBindings() {
        return Object.keys(this.stateMachine.bindings).length == 0;
    }
    makeBindingsLibrary() {
        this.bindings = [];
        if(this.noMoreBindings()) {
            return;
        }
        this.bindingsElement = document.createElement("section");
        this.bindingsElement.classList.add("binding-library");
        this.bindingsElement.classList.add("hidden");
        for(const binding in this.stateMachine.bindings) {
            const bindingEl = document.createElement("div");
            bindingEl.classList.add("binding");
            const title = document.createElement("p");
            title.classList.add("title");
            title.innerText = binding;
            bindingEl.appendChild(title);
            const remove = document.createElement("div");
            remove.innerText = "remove";
            remove.classList.add("remove-binding");
            remove.onclick = () => {
                delete this.stateMachine.bindings[binding];
                this.bindingsElement.removeChild(bindingEl);
                bindingEl.remove();
                if(this.noMoreBindings()) {
                    this.bindingsElement.remove();
                }
            };
            bindingEl.appendChild(remove);
            this.bindingsElement.appendChild(bindingEl);
            this.bindings.push(new Function(binding, bindingEl));
        }
        editor.appendChild(this.bindingsElement);
    }
    makeFunLibrary() {
        this.functions = [];
        this.funLibrary = document.createElement("section");
        this.funLibrary.classList.add("function-library");
        this.funLibrary.classList.add("hidden");
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
            this.fullFallback(false);
        } else if(event.key == ' ') {
            const start = this.left/this.stateMachine.sampleRate;
            const end = this.right/this.stateMachine.sampleRate;
            this.stateMachine.playSound(start, end - start);
        }
    }
    destroyElements() {
        this.element.remove();
        if(this.funLibrary != null) {
            this.funLibrary.remove();
        }
        if(this.bindingsElement != null) {
            this.bindingsElement.remove();
        }
        this.toggleLibraries.remove();
        controlsBottom.classList.remove("hidden");
    }
    cancel() {
        this.destroyElements();
        for(let i = this.left; i < this.right; i++) { // reset to previous state
            this.stateMachine.context.samples[i] = this.savedSamples[i - this.left];
        }
        for(const i in this.stateMachine.context.sampleElements) {
            this.stateMachine.context.updateElementValue(i);
        }
    }
    succeed() {
        this.destroyElements();
    }
}

export default Editing;