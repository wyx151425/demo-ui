let requestContext = "http://localhost:8090/demo/";

function getUrlParam(url, name) {
    let pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    let matcher = pattern.exec(url);
    let items = null;
    if (null !== matcher) {
        try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
            try {
                items = decodeURIComponent(matcher[1]);
            } catch (e) {
                items = matcher[1];
            }
        }
    }
    return items;
}

function getMessage(statusCode) {
    switch (statusCode) {
        case 500:
            return "系统错误";
        case 3000:
            return "推免计划已存在";
        case 4000:
            return "初试成绩未全部录入";
        case 4001:
            return "面试成绩未全部录入";
        case 4002:
            return "学生人数少于拟推免人数";
    }
}

const header = new Vue({
    el: "#header",
    data: {
        user: {}
    },
    methods: {
        logout: function () {
            axios.post(requestContext + "api/users/logout")
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode || 1004 === statusCode) {
                        localStorage.removeItem("user");
                        window.location.reload();
                    } else {
                        window.location.reload();
                    }
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                });
        }
    },
    mounted: function () {
        this.user = JSON.parse(localStorage.getItem("user"));
    }
});

const mask = new Vue({
    el: "#mask",
    data: {
        loading: true
    },
    methods: {
        loadSuccess: function () {
            this.loading = false;
        }
    }
});

Vue.component("popover", {
    props: ["prompt"],
    template: `
            <div class="popover" :class="{success: prompt.success, error: !prompt.success}">
                <span class="icon icon-ok" v-if="prompt.success"></span>
                <span class="icon icon-remove" v-if="!prompt.success"></span>
                <span>{{prompt.message}}</span>
            </div>
        `
});

const popoverSpace = new Vue({
    el: "#popoverSpace",
    data: {
        prompts: [],
        index: 0
    },
    methods: {
        append: function (message, success) {
            let prompt = {id: this.index, success: success, message: message};
            this.index++;
            this.prompts.push(prompt);
            setTimeout(function () {
                popoverSpace.prompts.shift(prompt);
            }, 5000);
        }
    }
});