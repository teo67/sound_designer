import FallbackMode from "./FallbackMode.js";
const extraStuff = document.getElementById("extra-stuff");

const uniquePrefix = "abc";

class InputCheckboxButton extends FallbackMode {
    constructor(stateMachine, fallback, text) {
        super(stateMachine, fallback);
        this.text = text;
        this.el = null;
        this.submit = null;
        this.counter = 0;
    }

    makeLabelAndInput(labelName, inputType, defaultValue) {
        const label = document.createElement("label");
        label.htmlFor = uniquePrefix + `${this.counter}`;
        label.innerText = labelName;
        label.classList.add("input-checkbox");
        const inputElement = document.createElement("input");
        inputElement.type = inputType;
        inputElement.name = uniquePrefix + `${this.counter}`;
        inputElement.id = uniquePrefix + `${this.counter}`;
        inputElement.value = defaultValue;
        inputElement.classList.add("input-checkbox");
        this.el.appendChild(label);
        this.el.appendChild(inputElement);
        this.el.appendChild(document.createElement("br"));
        this.counter++;
        return inputElement;
    }

    addComponents() {}

    enter() {
        this.counter = 0;
        this.el = document.createElement("section");
        this.el.classList.add("input-checkbox");
        const text = document.createElement("p");
        text.classList.add("input-checkbox");
        text.innerText = this.text;
        this.el.appendChild(text);
        this.addComponents();
        this.submit = document.createElement("div");
        this.submit.classList.add("input-checkbox");
        this.submit.innerText = 'submit (enter)';
        this.el.appendChild(this.submit);

        extraStuff.appendChild(this.el);

        this.submit.onclick = () => this.trySubmit();
    }

    async onSubmit() {
        return true;
    }

    displayError(text) {
        this.submit.innerText = text;
        setTimeout(() => {
            this.submit.innerText = 'submit (enter)';
        }, 1000);
    }

    async trySubmit() {
        if(await this.onSubmit()) {
            this.fullFallback(false);
        }
    }

    destroyElements() {
        this.el.remove();
    }

    onKeyDown(ev) {
        this.detectEscape(ev);
        if(ev.key == 'Enter') {
            this.trySubmit();
        }
    }

    cancel() {
        this.destroyElements();
    }

    succeed() {
        this.destroyElements();
    }
}

export default InputCheckboxButton;