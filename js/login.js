new Vue({
    el: "#login-app",
    data() {
        return {
            form: {
                account: "",
                password: "",
                auth: "",
            },
            authCode: "",
            required: {
                account: "帳號",
                password: "密碼",
                auth: "驗證碼",
            },
        };
    },
    methods: {
        doLogin() {
            try {
                this.validRequired();
                this.validAccount();
                this.validPassword();
                this.validAuthCode();
                this.doLoginProcess();
            } catch (e) {
                let msg = e instanceof Error ? e.message : e;
                this.errorMessage(msg);
            }
        },
        doLoginProcess() {
            fetch("db/member.json")
                .then((rep) => {
                    return rep.json();
                })
                .then((result) => {
                    let member = result.filter((m) => {
                        return m.account == this.form.account && m.password == this.form.password;
                    });
                    if (member.length > 0) {
                        this.doSaveMember(member[0]);
                        return this.successMessage("歡迎登入: " + member[0].name, () => {
                            location.href = "/";
                        });
                    }
                    this.errorMessage("登入失敗");
                });
        },
        doSaveMember(member) {
            localStorage.setItem("member", JSON.stringify(member));
        },
        validRequired() {
            for (let f in this.form) {
                if (!this.form[f] && this.required[f]) {
                    throw new Error(this.required[f] + "未填寫");
                }
            }
        },
        validPassword() {
            if (!this.form.password || this.form.password.length < 6) {
                throw new Error("密碼格式錯誤，至少六碼");
            }
        },
        validAccount() {
            let reg = /.*@.*\..*/;
            if (!this.form.account || !reg.test(this.form.account)) {
                throw new Error("帳號格式錯誤");
            }
        },
        validAuthCode() {
            if (this.authCode != this.form.auth) {
                throw new Error("驗證碼錯誤");
            }
        },
        makeAuthCode() {
            let auth = [];
            for (let i = 0; i < 5; i++) {
                auth.push(Math.round(Math.random() * 9));
            }

            return auth.join("");
        },
        doRenewAuthCode() {
            this.authCode = this.makeAuthCode();
        },
        errorMessage(message, callback) {
            Swal.fire({
                title: "錯誤",
                icon: "error",
                html: message,
            }).then(() => {
                if (typeof callback == "function") {
                    callback();
                }
            });
        },
        successMessage(message, callback) {
            Swal.fire({
                title: "完成",
                icon: "success",
                html: message,
            }).then(() => {
                if (typeof callback == "function") {
                    callback();
                }
            });
        },
        isLogin() {
            let member = localStorage.getItem("member");
            return member && JSON.parse(member).account;
        },
    },
    mounted() {
        this.doRenewAuthCode();
        if (this.isLogin()) {
            location.href = "/";
        }
    },
});
