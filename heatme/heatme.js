class HeatMe {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.radius = 50;
        this.blur = 0.5;
        this.min = 0;
        this.max = 1;
        this.gradient = { 0.75: 'rgb(0,0,255)', 0.45: 'rgb(0,255,0)', 0.15: 'yellow', 0: 'rgb(255,0,0)' };
        this._data = [];
        this._ctx = canvas.getContext('2d');
        this._palette = this._getColorPalette();
        this._alphaStamp = this._getAlphaStamp();
    }

    addValue(value, x, y) {
        this._data.push({ value, x, y });
        this._drawAlpha(value, x, y);
        this._colorize(x - this.radius, y - this.radius, this.radius * 2, this.radius * 2);
    }

    _getAlphaStamp() {
        const blur = 1 - this.blur;
        const radius = this.radius;
        const x = radius;
        const y = radius;        
        const alphaStamp = document.createElement('canvas');
        const alphaCtx = alphaStamp.getContext('2d');
        const gradient = this._ctx.createRadialGradient(x, y, radius * blur, x, y, radius);
        alphaStamp.width = alphaStamp.height = radius * 2;
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        alphaCtx.fillStyle = gradient;
        alphaCtx.fillRect(0, 0, 2 * radius, 2 * radius);
        return alphaStamp;
    }

    _drawAlpha(value, x, y) {
        this._ctx.globalAlpha = Math.max((value - this.min) / (this.max - this.min), 0.01);
        this._ctx.drawImage(this._alphaStamp, x - this.radius, y - this.radius);
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
        canvas.width = this.width = width;
        canvas.height = this.height = height;
        this.renderAll();
    }
}