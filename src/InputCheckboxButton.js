import FallbackMode from "./FallbackMode.js";
const extraStuff = document.getElementById("extra-stuff");

class InputCheckboxButton extends FallbackMode {
    constructor(stateMachine, fallback, options = {
        text, inputLabel, defaultValue, minInput, maxInput, checkboxLabel
    }) {
        super(stateMachine, fallback);
        this.options = options;
        this.el = null;
        this.inputElement = null;
        this.checkboxElement = null;
        this.submit = null;
    }

    makeLabelAndInput(labelName, inputType, defaultValue, parent, htmlFor) {
        const label = document.createElement("label");
        label.htmlFor = htmlFor;
        label.innerText = labelName;
        const inputElement = document.createElement("input");
        inputElement.type = inputType;
        inputElement.name = htmlFor;
        inputElement.id = htmlFor;
        inputElement.value = defaultValue;
        parent.appendChild(label);
        parent.appendChild(inputElement);
        return inputElement;
    }

    enter() {
        this.el = document.createElement("section");
        this.el.classList.add("change-menu");
        const text = document.createElement("p");
        text.classList.add("change-text");
        text.innerText = this.options.text;
        this.el.appendChild(text);

        this.inputElement = this.makeLabelAndInput(
            this.options.inputLabel, 'number', this.options.defaultValue, this.el, 'change-input'
        );
        this.inputElement.max = this.options.maxInput;
        this.inputElement.min = this.options.minInput;
        this.el.appendChild(document.createElement("br"));
        this.checkboxElement = this.makeLabelAndInput(
            this.options.checkboxLabel, 'checkbox', '', this.el, 'change-checkbox'
        );
        this.el.appendChild(document.createElement("br"));
        this.submit = document.createElement("div");
        this.submit.classList.add("change-submit");
        this.submit.innerText = 'submit (enter)';
        this.el.appendChild(this.submit);

        extraStuff.appendChild(this.el);

        this.submit.onclick = () => this.trySubmit();
    }

    onSubmit() {}

    trySubmit() {
        if(this.inputElement.value > this.options.maxInput) {
            this.ssubmit.innerText = `max input is ${this.options.maxInput}!`;
        } else if(this.inputElement.value < this.options.minInput) {
            this.submit.innerText = `min input is ${this.options.minInput}!`;
        } else {
            this.onSubmit();
            this.fullFallback(false);
            return;
        }
        setTimeout(() => {
            this.submit.innerText = 'submit (enter)';
        }, 1000);
    }

    destroyElements() {
        this.inputElement.remove();
        this.checkboxElement.remove();
        this.submit.remove();
        this.el.remove();
        this.el = null;
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