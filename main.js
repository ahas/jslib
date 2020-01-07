window.onload = function () {
    const valueInput = document.getElementById('value-input');
    const blendingOptions = document.getElementById('blending-options');
    const canvas = document.getElementById('canvas');
    let isMouseDown = false;
    let value = 10;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight - 100;
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
    
    canvas.onmousedown = canvas.ontouchstart = function (e) {
        isMouseDown = true;
        heatme.addValue(value, e.layerX, e.layerY);
    };

    canvas.onmousemove = canvas.ontouchmove =  function (e) {
        if (isMouseDown) {
            heatme.addValue(value, e.layerX, e.layerY);
        }
    };

    canvas.onmouseup = canvas.ontouchend =  function (e) {
        isMouseDown = false;
    };

    window.onresize = function (e) {
        heatme.resize(document.body.clientWidth, document.body.clientHeight - 100);
    };
};