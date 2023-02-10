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
    let auth = $("#auth-code-hint");
    auth.html(dbAccount.authCode);
    // let auth = document.querySelector("#auth-code-hint");
    // if (auth) {
    //     auth.innerHTML = dbAccount.authCode;
    // }
}

let loginBtn = $("#login-btn");
// let loginBtn = document.querySelector("#login-btn");

loginBtn.on("click", (e) => {
    e.preventDefault();
    let account = getAccount();
    let password = getPassword();
    let authCode = getAuthCode();

    if (validAccount(account) && validPassword(password) && validAuthCode(authCode)) {
        login(account, password);
    }
});
// loginBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     let account = getAccount();
//     let password = getPassword();
//     let authCode = getAuthCode();

//     if (validAccount(account) && validPassword(password) && validAuthCode(authCode)) {
//         login(account, password);
//     }
// });

function getAccount() {
    let account = $("#account");
    return account.val();
    // return account ? account.value : "";
}

function getPassword() {
    let password = $("#password");
    return password.val();
    // return password ? password.value : "";
}

function getAuthCode() {
    let auth = $("#auth-code");
    return auth.val();
    // return auth ? auth.value : "";
}

function validAuthCode(authCode) {
    if (dbAccount.authCode != authCode) {
        errorMessage("驗證碼錯誤", () => {
            setTimeout(() => {
                let auth = $("#auth-code");
                // let auth = document.querySelector("#auth-code");
                auth.focus();
                // auth ? auth.focus() : "";
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
                let account = $("#account");
                // let account = document.querySelector("#account");
                account.focus();
                // account ? account.focus() : "";
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
                let password = $("#password");
                // let password = document.querySelector("#password");
                password.focus();
                // password ? password.focus() : "";
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
