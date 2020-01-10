class HeatMe {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.radius = 50;
        this.blur = 0.5;
        this.min = 0;
        this.max = 1;
        this.gradient = { 0.75: 'rgb(0, 0, 255)', 0.45: 'rgb(0, 255, 0)', 0.15: 'yellow', 0: 'rgb(255, 0, 0)' };
        this._data = [];
        this._ctx = canvas.getContext('2d');
        this._palette = this._getColorPalette();
        this._alphaStamps = {};
        this._alphaGradients = {};
    }

    addValue(value, x, y, radius, colorize) {
        radius = radius || this.radius;
        colorize = colorize == undefined ? true : colorize;
        this._data.push({ value, x, y });
        this._drawAlpha(value, x, y, radius);
        if (colorize) {
            this._colorize(x - radius, y - radius, radius * 2, radius * 2);
        }
    }

    _getAlphaGradient(radius) {
        if (!this._alphaGradients[radius]) {
            this._alphaGradients[radius] = this._ctx.createRadialGradient(radius, radius, radius * (1 - this.blur), radius, radius, radius);
        }
        return this._alphaGradients[radius];
    }

    _getAlphaStamp(radius) {
        if (!this._alphaStamps[radius]) {
            const alphaCanvas = document.createElement('canvas');
            const alphaCtx =  alphaCanvas.getContext('2d');
            const gradient = this._getAlphaGradient(radius);
            alphaCtx.clearRect(0, 0, alphaCanvas.width, alphaCanvas.height);
            alphaCanvas.width = alphaCanvas.height = radius * 2;
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            alphaCtx.fillStyle = gradient;
            alphaCtx.fillRect(0, 0, 2 * radius, 2 * radius);
            this._alphaStamps[radius] = alphaCanvas;
        }
        return this._alphaStamps[radius];
    }

    _drawAlpha(value, x, y, radius) {
        radius = Math.max(radius, 1);
        this._ctx.globalAlpha = Math.max((value - this.min) / (this.max - this.min), 0.01);
        this._ctx.drawImage(this._getAlphaStamp(radius), x - radius, y - radius);
    }

    _getColorPalette() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 1;
        const gradient = this._ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        for (const key in this.gradient) {
            gradient.addColorStop(1 - key, this.gradient[key]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    _colorize(x, y, width, height) {
        width = Math.max(width, 1);
        height = Math.max(height, 1);
        const img = this._ctx.getImageData(x, y, width, height);
        const pixels = img.data;
        for (let cx = 0; cx < width; cx++) {
            for (let cy = 0; cy < height; cy++) {
                const i = (img.width * cy + cx) * 4;
                const alpha = pixels[i + 3];
                let offset = alpha * 4;
                pixels[i] = this._palette[offset++];
                pixels[i + 1] = this._palette[offset++];
                pixels[i + 2] = this._palette[offset++];
            }
        }
        this._ctx.putImageData(img, x, y);
    }

    colorize() {
        this._colorize(0, 0, this.width, this.height);
    }

    clear() {
        this._ctx.clearRect(0, 0, this.width, this.height);
        this._data = [];
    }

    renderAll() {
        this._ctx.clearRect(0, 0, this.width, this.height);
        for (const d of this._data) {
            this._drawAlpha(d.value, d.x, d.y);
        }
        this._colorize(0, 0, this.width, this.height);
    }

    setBlending(mode) {
        this._ctx.globalCompositeOperation = mode;
        this.renderAll();
    }

    resize(width, height) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
        this.renderAll();
    }
}