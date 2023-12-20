import InputCheckboxButton from "../classes/InputCheckboxButton.js";

class Exporting extends InputCheckboxButton {
    constructor(stateMachine, fallback) {
        super(stateMachine, fallback, "export options");
        this.filename = null;
        this.blob = null;
    }
    enter() {
        let buffer = new ArrayBuffer(44 + this.stateMachine.context.samples.length * 2);
        let view = new DataView(buffer);

        /* RIFF identifier */
        this.writeString(view, 0, 'RIFF');
        /* RIFF chunk length */
        view.setUint32(4, 36 + this.stateMachine.context.samples.length * 2, true);
        /* RIFF type */
        this.writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        this.writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, 1, true);
        /* sample rate */
        view.setUint32(24, this.stateMachine.sampleRate, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, this.stateMachine.sampleRate * 4, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        this.writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, this.stateMachine.context.samples.length * 2, true);

        this.floatTo16BitPCM(view, 44, this.stateMachine.context.samples);

        this.blob = new Blob([view], {type: 'audio/wav'});
        super.enter();
    }
    addComponents() {
        this.filename = this.makeLabelAndInput("file name", "text", "my-sound");
    }
    onSubmit() {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
    
        const url = window.URL.createObjectURL(this.blob);
        a.href = url;
        a.download = this.filename.value + ".wav";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        return true;
    }
    floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }
    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}

export default Exporting;