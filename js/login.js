const main = new Vue({
    el: "#main",
    data: {
        user: {
            username: "",
            password: ""
        },
        type: "password",
        isDisabled: false,
        action: "登录"
    },
    methods: {
        removeUsername: function () {
            this.user.username = "";
        },
        typeExchange: function () {
            if ("password" === this.type) {
                this.type = "text";
            } else {
                this.type = "password";
            }
        },
        login: function () {
            if ("" === this.user.username) {
                popoverSpace.append("请输入用户名", false);
                return;
            }
            if ("" === this.user.password) {
                popoverSpace.append("请输入密码", false);
                return;
            }
            if (this.user.password.length < 6 || this.user.password.length > 32) {
                popoverSpace.append("请输入正确格式的密码", false);
                return;
            }
            this.loginStart();
            axios.post(requestContext + "api/users/login", this.user)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        localStorage.setItem("user", JSON.stringify(response.data.data));
                        window.location.href = requestContext;
                    } else {
                        let message = getMessage(statusCode);
                        popoverSpace.append(message, false);
                        main.loginResult();
                    }
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    main.loginResult();
                });
        },
        loginStart: function () {
            this.isDisabled = true;
            this.action = "正在登录";
        },
        loginResult: function () {
            this.action = "登录";
            this.isDisabled = false;
        }
    }
});