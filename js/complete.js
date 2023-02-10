new Vue({
    el: "#complete-app",
    data() {
        return {
            items: {},
            subtotal: 0,
            shipping: 80,
            total: 0,
            order: {},
        };
    },
    methods: {
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

            return { order: order, orderItems: inOrderItems };
        },
    },
    mounted() {
        let params = location.search.substr(1).split("&");
        if (!params) {
            location.href = "/";
            return false;
        }
        let data = {};
        params.forEach((param) => {
            let tmp = param.split("=");
            data[tmp[0]] = tmp[1];
        });
        let order = this.fetchOrder(data.no);
        this.order = order.order;
        this.items = order.orderItems;
        this.subtotal = order.order.subtotal;
        this.shipping = order.order.shipping;
        this.total = order.order.total;
    },
});
