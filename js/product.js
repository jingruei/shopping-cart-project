new Vue({
    el: "#product-app",
    data() {
        return {
            product: {
                type: "Type",
                name: "Name",
                price: 0,
            },
        };
    },
    methods: {
        init() {
            let id = this.getId();
            if (!id) {
                location.href = "product.html?id=1";
            }
            fetch("db/product.json")
                .then((rep) => {
                    return rep.json();
                })
                .then((result) => {
                    let products = result.filter((p) => {
                        return p.id == id;
                    });
                    if (products.length > 0) {
                        this.product = products[0];
                    }
                });
        },
        getId() {
            let params = location.search.substr(1).split("&");
            let data = {};
            params.forEach((param) => {
                let tmp = param.split("=");
                data[tmp[0]] = tmp[1];
            });
            return data["id"];
        },
        doAddCart() {
            let id = this.getId();
            if (!id) {
                alert("不合法的商品");
                location.href = "/";
                return false;
            }

            let carts = this.getCarts();
            if (carts[id]) {
                carts[id].qty++;
            } else {
                carts[id] = this.product;
                carts[id].qty = 1;
            }

            localStorage.setItem("carts", JSON.stringify(carts));

            alert("加入購物車完成");
            location.href = "cart.html";
        },
        getCarts() {
            let carts = localStorage.getItem("carts");
            if (carts) {
                return JSON.parse(carts);
            }
            return {};
        },
    },
    mounted() {
        this.init();
    },
});
