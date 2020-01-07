window.onload = function () {
    const valueInput = document.getElementById('value-input');
    const blendingOptions = document.getElementById('blending-options');
    const canvas = document.getElementById('canvas');
    let isMouseDown = false;
    let value = 10;
    canvas.width = canvas.height = 1000;
    const heatme = new HeatMe(canvas);
    heatme.min = 0;
    heatme.max = 50;

    valueInput.value = value;
    valueInput.onchange = function (e) {
        value = Number(e.target.value);
    };

    blendingOptions.onchange = function (e) {
        heatme.setBlending(e.target.value);
    }
    
    canvas.onmousedown = canvas.touchstart = function (e) {
        isMouseDown = true;
        heatme.addValue(value, e.layerX, e.layerY);
    };

    canvas.onmousemove = canvas.touchmove =  function (e) {
        if (isMouseDown) {
            heatme.addValue(value, e.layerX, e.layerY);
        }
    };

    canvas.onmouseup = canvas.touchend =  function (e) {
        isMouseDown = false;
    };


};