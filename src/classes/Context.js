const maxSampleElements = 2500;
const samplesHolder = document.getElementById("samples");
const scrollview = document.getElementById("scrollview");
const zoomview = document.getElementById("zoomview");

class Context {
    constructor(samples, sampleRate, parent) {
        this.samples = samples;
        this.sampleElements = {};
        this.sampleRate = sampleRate;
        this.sampleSize = 2;
        this.offset = 0;
        this.docWidth = 0;
        this.docHeight = 0;
        this.scrolling = false;
        this.zooming = false;
        this.samplesPerElement = null;
        this.parent = parent;
    }
    onScrollerDown() {
        this.scrolling = true;
    }
    onZoomerDown() {
        this.zooming = true;
    }
    onMouseUp(ev) {
        if(this.zooming) {
            const vwOffset = this.getVwOffset(ev, 82.5, 0, 14);
            this.setScale(vwOffset, 100 / ((vwOffset/14) * (this.samples.length - 50) + 50));

            if(this.parent != null) {
                this.parent.currentState.onScale();
            }
        }
        this.scrolling = false;
        this.zooming = false;
    }
    getVwOffset(ev, left, min, max) {
        const vwOffset = ((ev.clientX/this.docWidth)*100 - left);
        return Math.max(min, Math.min(vwOffset, max));
    }
    onMouseMove(ev) {
        if(this.scrolling) {
            const vwOffset = this.getVwOffset(ev, 6.5, 0, 75);
            const savedOffset = this.offset;
            this.offset = Math.round(this.samples.length * (vwOffset/75));
            this.reloadOffsetVisuals();
            this.reloadScrollVisuals(savedOffset);
            
            if(this.parent != null) {
                this.parent.currentState.onScroll();
            }
        } else if(this.zooming) {
            const vwOffset = this.getVwOffset(ev, 82.5, 0, 14);
            zoomview.style.left = `${vwOffset}vw`;
        }
    }
    onResize() {
        const body = document.body;
        const html = document.documentElement;
        this.docHeight = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.offsetHeight );
        this.docWidth = Math.max( body.scrollWidth, body.offsetWidth, 
            html.clientWidth, html.offsetWidth );
    }
    clearSamplesHolder() {
        while(samplesHolder.firstChild) {
            samplesHolder.removeChild(samplesHolder.firstChild);
        }
    }
    initialize() {
        this.clearSamplesHolder();
        scrollview.style.left = '0';
        zoomview.style.left = '0';
        this.setScale(0, this.sampleSize);
        this.onResize();
    }
    setScale(vwOffset, scale) {
        zoomview.style.left = `${vwOffset}vw`;
        this.sampleSize = Math.max(scale, 100/this.samples.length);
        scrollview.style.width = `${75 * (100 / (this.samples.length * this.sampleSize))}vw`;
        const savedOffset = this.offset;
        this.reloadOffsetVisuals();
        this.reloadSampleElementRatio();
        this.reloadScrollVisuals(savedOffset);
        this.reloadScaleVisuals();
    }
    inRange(sampleNum) {
        return Math.max(0, Math.min(this.samples.length - 1, sampleNum));
    }
    reloadSampleElementRatio() {
        const newSamplesPerElement = Math.max(1, 100/(this.sampleSize * maxSampleElements));
        if(newSamplesPerElement != this.samplesPerElement) {
            this.clearSamplesHolder();
            for(const element in this.sampleElements) {
                this.sampleElements[element].remove();
            }
            this.sampleElements = {};
            this.samplesPerElement = newSamplesPerElement;
        }
    }
    reloadScaleVisuals() {
        for(const i in this.sampleElements) {
            this.updateElementScaleVisual(this.sampleElements[i], i);
        }
    }
    reloadScrollVisuals(previousOffset) {
        const l = val => Math.floor(val/this.samplesPerElement);
        const r = val => Math.ceil(val/this.samplesPerElement);
        const L1 = l(this.offset);
        const R1 = r(this.offset + 100/this.sampleSize);
        for(let i = L1; i < R1; i++) {
            if(this.sampleElements[i] == undefined) {
                this.sampleElements[i] = document.createElement("div");
                this.sampleElements[i].classList.add("sample");
                samplesHolder.appendChild(this.sampleElements[i]);
                this.updateElementScaleVisual(this.sampleElements[i], i);
                this.updateElementValue(i);
            }
        }
        // optimization? remove all elements that used to be in view
        if(previousOffset == this.offset) {
            return;
        }
        let L2;
        let R2;
        if(previousOffset < this.offset) {
            L2 = l(previousOffset);
            R2 = L1;
        } else {
            L2 = R1;
            R2 = r(previousOffset + 100/this.sampleSize);
        }
        for(let i = L2; i < R2; i++) {
            if(this.sampleElements[i] != undefined) {
                this.sampleElements[i].remove();
                delete this.sampleElements[i];
            }
        }
    }
    updateElementScaleVisual(el, elementNumber) {
        el.style.width = `${this.sampleSize * this.samplesPerElement}vw`;
        el.style.left = `${this.sampleSize * this.samplesPerElement * elementNumber}vw`;
    }
    updateElementValue(i) {
        const leftSide = this.inRange(Math.floor(i * this.samplesPerElement));
        const rightSide = this.inRange(Math.ceil(i * this.samplesPerElement));
        const average = this.samples[leftSide]/2 + this.samples[rightSide]/2;
        this.displayElementValue(this.sampleElements[i], average);
    }
    reloadOffsetVisuals() {
        this.offset = Math.min(this.offset, this.samples.length - 100/this.sampleSize);
        scrollview.style.left = `${this.offset/this.samples.length * 75}vw`;
        samplesHolder.style.left = `${-1 * this.offset * this.sampleSize}vw`;
    }
    displayElementValue(el, val) {
        const abs = Math.abs(val);
        el.style.height = `${abs * 50}vh`;
        el.style.backgroundColor = `rgb(${(1 - abs) * 170 + abs * 255}, ${118}, ${(1 - abs) * 255 + abs * 247})`;
        el.style.bottom = `${50 + Math.min(val, 0) * 50}vh`; 
    }
    setSampleValue(i, val) {
        this.samples[i] = val;
    }
    getSampleFactor() {
        return (1 / this.docWidth * 100) / this.sampleSize;
    }
    getXFromSample(sam) {
        return (sam - this.offset) / this.getSampleFactor();
    }
    getSampleFromX(x) {
        return Math.round(x * this.getSampleFactor() + this.offset);
    }
}

export default Context;