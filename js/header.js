new Vue({
    el: "#header",
    data() {
        return {
            member: {},
        };
    },
    methods: {
        doLogout() {
            localStorage.removeItem("member");
            this.member = {};
        },
        isLogin() {
            let member = localStorage.getItem("member");
            return member && JSON.parse(member).account;
        },
    },
    mounted() {
        if (this.isLogin()) {
            this.member = JSON.parse(localStorage.getItem("member"));
        }
    },
});
