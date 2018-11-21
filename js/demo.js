let requestContext = "http://localhost:8090/demo/";

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