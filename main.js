new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        const tabs = ['heatme', 'plasme'];
        const initialTabName = window.location.search ? new URLSearchParams(window.location.search).get('tab') : 'heatme';
        return {
            tab: tabs.indexOf(initialTabName)
        };
    }
});