Vue.component('heatme-test', {
    template: `
    <div>
        <v-text-field v-model="value" label="value"></v-text-field>
        <canvas ref="canvas" style="display: block; width: 100%;"></canvas>
    </div>
    `,
    data() {
        return {
            value: 10,
            isMouseDown: false
        };
    },
    methods: {
        addValue(heatme, e) {
            if (e.touches) {
                heatme.addValue(this.value, e.touches[0].pageX, e.touches[0].pageY)
            } else {
                heatme.addValue(this.value, e.layerX, e.layerY)
            }
        }
    },
    mounted() {
        const canvas = this.$refs.canvas;
        const heatme = new HeatMe(canvas);
        heatme.resize(canvas.clientWidth, document.body.clientHeight - 100);
        heatme.min = 0;
        heatme.max = 50;
        
        canvas.onmousedown = canvas.ontouchstart = (e) => {
            this.isMouseDown = true;
            this.addValue(heatme, e);
        };
    
        canvas.onmousemove = canvas.ontouchmove = (e) => {
            if (this.isMouseDown) {
                this.addValue(heatme, e);
            }
        };
    
        canvas.onmouseup = canvas.ontouchend = () => {
            this.isMouseDown = false;
        };
    
        window.addEventListener('resize', () => {
            heatme.resize(canvas.clientWidth, document.body.clientHeight - 100);
        });
    }
});