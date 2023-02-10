new Vue({
    el: "#cart-app",
    data() {
        return {
            items: {},
            subtotal: 0,
            shipping: 80,
            total: 0,
            memberAccount: "",
            receiver: {
                name: "",
                email: "",
                address: "",
            },
        };
    },
    methods: {
        init() {
            this.checkHasCart();

            let carts = localStorage.getItem("carts");

            if (carts) {
                carts = JSON.parse(carts);
                this.items = carts;
            } else {
                this.items = {};
            }

            this.calcPrice();
        },
        doRemove(id) {
            if (this.items[id]) {
                delete this.items[id];
            }

            localStorage.setItem("carts", JSON.stringify(this.items));
            this.init();
            this.$forceUpdate();
        },
        checkHasCart() {
            let carts = localStorage.getItem("carts");
            if (!carts || carts == "{}") {
                alert("購物車無商品");
                location.href = "/";
            }
        },
        calcPrice() {
            this.subtotal = 0;
            this.total = 0;
            let carts = this.items;
            for (let id in carts) {
                this.subtotal += +carts[id].price * +carts[id].qty;
            }
            this.total = this.subtotal + this.shipping;
        },
        hasLogin() {
            let member = localStorage.getItem("member");
            if (!member || !JSON.parse(member).account) {
                location.href = "login.html";
                return false;
            }
            this.memberAccount = JSON.parse(member).account;
            return true;
        },
        doOrder() {
            for (let f in this.receiver) {
                if (!this.receiver[f]) {
                    alert("收件資料未填寫");
                    return false;
                }
            }

            if (!/.*@.*\..*/.test(this.receiver.email)) {
                alert("信箱格式錯誤");
                return false;
            }

            let order = this.createOrder(this.receiver);
            this.createOrderItems(order.id);
            alert("訂單成立");
            location.href = "complete.html?no=" + order.no;
        },
        createOrder(data) {
            data.member_account = this.memberAccount;
            data.subtotal = this.subtotal;
            data.shipping = this.shipping;
            data.total = this.total;
            data.no = this.getOrderNo();
            data.id = this.getOrderId();

            let orders = this.getOrders();
            orders.push(data);
            localStorage.setItem("orders", JSON.stringify(orders));
            return data;
        },
        createOrderItems(orderId) {
            let orderItems = this.getOrderItems();
            for (let i in this.items) {
                let item = this.items[i];
                item.total = +item.price * +item.qty;
                item.order_id = orderId;
                orderItems.push(item);
            }

            localStorage.setItem("order_items", JSON.stringify(orderItems));
        },
        getOrderNo() {
            let dt = new Date();

            let today = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()];
            if (today[1] < 10) {
                today[1] = "0" + today[1];
            }

            if (today[2] < 10) {
                today[2] = "0" + today[2];
            }

            let orders = this.getOrders();
            let isToday = new RegExp("^" + today.join(""));
            let todayOrders = orders.filter((order) => {
                return isToday.test(order.no);
            });

            let isTodayLen = todayOrders.length;
            if (isTodayLen > 0) {
                let lastOrder = todayOrders[isTodayLen - 1];
                return +lastOrder.no + 1;
            }

            today[3] = "001";

            return today.join("");
        },
        getOrderId() {
            let orders = this.getOrders();
            return orders.length + 1;
        },
        getOrders() {
            let orders = localStorage.getItem("orders");
            orders = orders ? JSON.parse(orders) : [];
            return orders;
        },
        getOrderItems() {
            let items = localStorage.getItem("order_items");
            items = items ? JSON.parse(items) : [];
            return items;
        },
        doSave() {
            localStorage.setItem("carts", JSON.stringify(this.items));
            this.calcPrice();
        },
        fetchOrder(no) {
            let orders = this.getOrders();
            let inOrders = orders.filter((od) => {
                return od.no == no;
            });

            if (inOrders.length <= 0) {
                return false;
            }

            let order = inOrders[0];

            let orderItems = this.getOrderItems();
            let inOrderItems = orderItems.filter((item) => {
                return item.order_id == order.id;
            });
        },
    },
    mounted() {
        if (!this.hasLogin()) {
            return false;
        }
        this.init();

        // this.hasLogin() && this.init();
    },
});
