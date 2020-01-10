Vue.component('plasme-test', {
    template: `
        <canvas ref="canvas" style="display: block; width: 100%;"></canvas>
    `,
    mounted() {
        const canvas = this.$refs.canvas;
        const heatme = new HeatMe(canvas);
        heatme.resize(canvas.clientWidth, canvas.clientHeight - 100);
        heatme.max = 1;
        const radius = heatme.radius = 50;
        const points = [];
        const xspace = radius * 2;
        const yspace = xspace;
        let direction = 1;
        for (let x = 0; x < canvas.width; x += xspace) {
            for (let y = 0; y < canvas.height; y += yspace) {
                points.push({
                    value: heatme.max * 0.8,
                    x,
                    y,
                    dx: x,
                    dy: y,
                    range: radius,
                    direction
                });
                direction *= -1;
                points.push({
                    value: heatme.max * 0.8,
                    x,
                    y,
                    dx: x,
                    dy: y,
                    range: radius,
                    direction
                });
            }
        }

        let t = 0;
        const interval = 100;
        function update() {
            t += 0.1;
            heatme.clear();
            for (const point of points) {
                point.dx = point.x + Math.cos(t) * point.range * point.direction;
                point.dy = point.y + Math.sin(t) * point.range * point.direction;
                heatme.addValue(point.value, point.dx, point.dy, Math.abs(radius * Math.sin(t)), false);
            }
            heatme.colorize();
        }

        setInterval(update, interval);
    }
});