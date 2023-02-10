new Vue({
    el: "#index-app",
    data() {
        return {
            items: [],
        };
    },
    methods: {
        init() {
            fetch("db/product.json")
                .then((rep) => {
                    return rep.json();
                })
                .then((result) => {
                    this.items = result;
                });
        },
        makeProductUrl(id) {
            return "product.html?id=" + id;
        },
    },
    mounted() {
        this.init();
    },
});

// location.search.substr(1).split('&')
