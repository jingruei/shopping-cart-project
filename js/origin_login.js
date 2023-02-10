let dbAccount = {
    account: "david@gmail.com",
    password: "12345678",
    authCode: makeAuthCode(),
};

setAuthCodeHint();

function makeAuthCode() {
    let auth = [];
    for (let i = 0; i < 5; i++) {
        auth.push(Math.round(Math.random() * 9));
    }

    return auth.join("");
}

function setAuthCodeHint() {
    let auth = document.querySelector("#auth-code-hint");
    if (auth) {
        auth.innerHTML = dbAccount.authCode;
    }
}

let loginBtn = document.querySelector("#login-btn");

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let account = getAccount();
    let password = getPassword();
    let authCode = getAuthCode();

    if (validAccount(account) && validPassword(password) && validAuthCode(authCode)) {
        login(account, password);
    }
});

function getAccount() {
    let account = document.querySelector("#account");
    return account ? account.value : "";
}

function getPassword() {
    let password = document.querySelector("#password");
    return password ? password.value : "";
}

function getAuthCode() {
    let auth = document.querySelector("#auth-code");
    return auth ? auth.value : "";
}

function validAuthCode(authCode) {
    if (dbAccount.authCode != authCode) {
        errorMessage("驗證碼錯誤", () => {
            setTimeout(() => {
                let auth = document.querySelector("#auth-code");
                auth ? auth.focus() : "";
            }, 500);
        });
        return false;
    }
    return true;
}

function validAccount(account) {
    let reg = /.*@.*\..*/;
    if (!account || !reg.test(account)) {
        errorMessage("帳號格式錯誤", () => {
            setTimeout(() => {
                let account = document.querySelector("#account");
                account ? account.focus() : "";
            }, 500);
        });
        return false;
    }
    return true;
}

function validPassword(password) {
    if (!password || password.length < 6) {
        errorMessage("密碼格式錯誤，至少六碼", () => {
            setTimeout(() => {
                let password = document.querySelector("#password");
                password ? password.focus() : "";
            }, 500);
        });
        return false;
    }
    return true;
}

function login(account, password) {
    if (account != dbAccount.account || password != dbAccount.password) {
        return errorMessage("登入失敗");
    }

    successMessage("登入成功");
}

function errorMessage(message, callback) {
    Swal.fire({
        title: "錯誤",
        icon: "error",
        html: message,
    }).then(() => {
        if (typeof callback == "function") {
            callback();
        }
    });
}

function successMessage(message, callback) {
    Swal.fire({
        title: "完成",
        icon: "success",
        html: message,
    }).then(() => {
        if (typeof callback == "function") {
            callback();
        }
    });
}
