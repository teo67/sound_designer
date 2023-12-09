class Context {
    constructor(samples, samplesHolder, sampleRate, scrollview, zoomview) {
        this.samples = samples;
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
        } else if(this.zooming) {
            const vwOffset = this.getVwOffset(ev, 81.5, 0, 14);
            this.zoomview.style.left = `${vwOffset}vw`;
            this.setScale(100 / ((vwOffset/14) * (this.samples.length - 1) + 1));
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
            
            const newElement = document.createElement("div");
            newElement.classList.add("sample");
            this.samplesHolder.appendChild(newElement);

            this.displayElementValue(i, this.samples[i]);
        }
        this.setScale(this.sampleSize);
        this.onResize();
    }
    setScale(scale) {
        this.sampleSize = scale;
        for(let i = 0; i < this.samplesHolder.children.length; i++) {
            const child = this.samplesHolder.children[i];
            child.style.width = `${this.sampleSize}vw`;
            child.style.left = `${this.sampleSize * i}vw`;
        }
        this.scrollview.style.width = `${75 * (100 / (this.samples.length * this.sampleSize))}vw`;
        this.reloadOffsetVisuals();
    }
    reloadOffsetVisuals() {
        this.offset = Math.min(this.offset, this.samples.length - 100/this.sampleSize);
        this.scrollview.style.left = `${this.offset/this.samples.length * 75}vw`;
        this.samplesHolder.style.left = `${-1 * this.offset * this.sampleSize}vw`;
    }
    displayElementValue(i, val) {
        const el = this.getElement(i);
        el.style.height = `${Math.abs(val) * 50}vh`;
        el.style.bottom = `${50 + Math.min(val, 0) * 50}vh`; 
    }
    setElementValue(i, val) {
        this.samples[i] = val;
    }
    getElement(i) {
        return this.samplesHolder.children[i];
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