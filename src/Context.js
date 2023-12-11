const maxSampleElements = 5000;

class Context {
    constructor(samples, samplesHolder, sampleRate, scrollview, zoomview) {
        this.samples = samples;
        this.sampleElements = [];
        this.samplesHolder = samplesHolder;
        this.sampleRate = sampleRate;
        this.sampleSize = 1;
        this.offset = 0;
        this.docWidth = 0;
        this.docHeight = 0;
        this.scrollview = scrollview;
        this.zoomview = zoomview;
        this.scrolling = false;
        this.zooming = false;
        this.samplesPerElement = null;
        this.parent = null;
    }
    onScrollerDown() {
        this.scrolling = true;
    }
    onZoomerDown() {
        this.zooming = true;
    }
    onMouseUp() {
        this.scrolling = false;
        this.zooming = false;
    }
    getVwOffset(ev, left, min, max) {
        const vwOffset = ((ev.clientX/this.docWidth)*100 - left);
        return Math.max(min, Math.min(vwOffset, max));
    }
    onMouseMove(ev) {
        if(this.scrolling) {
            const vwOffset = this.getVwOffset(ev, 6, 0, 75);
            this.offset = Math.round(this.samples.length * (vwOffset/75));
            this.reloadOffsetVisuals();
            this.reloadScrollVisuals();
            
            if(this.parent != null) {
                this.parent.currentState.onScroll();
            }
        } else if(this.zooming) {
            const vwOffset = this.getVwOffset(ev, 81.5, 0, 14);
            this.zoomview.style.left = `${vwOffset}vw`;
            this.setScale(100 / ((vwOffset/14) * (this.samples.length - 1) + 1));

            if(this.parent != null) {
                this.parent.currentState.onScale();
            }
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
    initialize() {
        for(let i = 0; i < this.samples.length; i++) {
            this.samples[i] = 0.5;
            
            // const newElement = document.createElement("div");
            // newElement.classList.add("sample");
            // this.samplesHolder.appendChild(newElement);

            // this.displayElementValue(i, this.samples[i]);
        }
        this.setScale(this.sampleSize);
        this.onResize();
    }
    setScale(scale) {
        this.sampleSize = scale;
        this.scrollview.style.width = `${75 * (100 / (this.samples.length * this.sampleSize))}vw`;
        this.reloadOffsetVisuals();
        this.reloadSampleElementRatio();
        this.reloadScrollVisuals();
        this.reloadScaleVisuals();
        console.log(this.samplesHolder.children.length);
    }
    inRange(sampleNum) {
        return Math.max(0, Math.min(this.samples.length - 1, sampleNum));
    }
    reloadSampleElementRatio() {
        const newSamplesPerElement = Math.max(1, 100/(this.sampleSize * maxSampleElements));
        if(newSamplesPerElement != this.samplesPerElement) {
            while(this.samplesHolder.firstChild) {
                this.samplesHolder.removeChild(this.samplesHolder.firstChild);
            }
            for(const element of this.sampleElements) {
                element.remove();
            }
            this.sampleElements = [];
            this.sampleElements.length = Math.ceil(this.samples.length / newSamplesPerElement);
            this.sampleElements.fill(null);
            this.samplesPerElement = newSamplesPerElement;
        }
    }
    reloadScaleVisuals() {
        for(let i = 0; i < this.samplesHolder.children.length; i++) {
            this.updateElementScaleVisual(this.samplesHolder.children[i], i);
        }
    }
    reloadScrollVisuals() {
        // assume only changes in scroll
        for(let i = Math.floor(this.offset / this.samplesPerElement); 
            i <= Math.ceil((this.offset + 100/this.sampleSize) / this.samplesPerElement); 
            i++
        ) {
            if(i >= this.sampleElements.length) {
                break;
            }
            if(this.sampleElements[i] == null) {
                this.sampleElements[i] = document.createElement("div");
                this.sampleElements[i].classList.add("sample");
                this.samplesHolder.appendChild(this.sampleElements[i]);
                this.updateElementScaleVisual(this.sampleElements[i], i);
                this.updateElementValue(i);
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
        this.scrollview.style.left = `${this.offset/this.samples.length * 75}vw`;
        this.samplesHolder.style.left = `${-1 * this.offset * this.sampleSize}vw`;
    }
    displayElementValue(el, val) {
        el.style.height = `${Math.abs(val) * 50}vh`;
        el.style.bottom = `${50 + Math.min(val, 0) * 50}vh`; 
    }
    setElementValue(i, val) {
        this.samples[i] = val;
    }
    getSampleFactor() {
        return (1 / this.docWidth * 100) / this.sampleSize;
    }
    getXFromSample(sam) {
        return (sam - this.offset) / this.getSampleFactor();
    }
    getSampleFromX(x) {
        return Math.floor(x * this.getSampleFactor() + this.offset);
    }
}

export default Context;