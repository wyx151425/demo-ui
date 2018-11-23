const container = new Vue({
    el: "#container",
    data: {
        planList: []
    },
    methods: {
        setPlanList: function (planList) {
            this.planList = planList;
        },
        planReleaseModalVisible: function () {
            planReleaseModal.visible();
        },
        planUpdateModalVisible: function (plan) {
            planUpdateModal.visible(plan);
        }
    },
    mounted: function () {
        axios.get(requestContext + "api/plans")
            .then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    container.setPlanList(response.data.data);
                } else {
                    popoverSpace.append("数据获取失败", false);
                }
                mask.loadSuccess();
            })
            .catch(function () {
                popoverSpace.append("服务器访问失败", false);
                mask.loadSuccess();
            });
    }
});

const planReleaseModal = new Vue({
    el: "#planReleaseModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "发布",
        plan: {
            year: "",
            quantity: "",
        },
    },
    methods: {
        visible: function () {
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        releasePlan: function () {
            let regexp = /^[2][0][0-9]{2}$/;
            if ("" === this.plan.year || 4 !== this.plan.year.length || !regexp.test(this.plan.year)) {
                popoverSpace.append("请填写正确的计划年份");
                return;
            }
            if ("" === this.plan.quantity) {
                popoverSpace.append("请填写推免人数");
                return;
            }
            this.isDisabled = true;
            this.action = "正在发布";
            axios.post(requestContext + "api/plans", this.plan)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("发布成功", true);
                        window.location.reload();
                    } else {
                        let message = getMessage(statusCode);
                        popoverSpace.append(message, false);
                    }
                    planReleaseModal.releaseCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    planReleaseModal.releaseCallback();
                });
        },
        releaseCallback: function () {
            this.action = "发布";
            this.isDisabled = false;
        }
    }
});

const planUpdateModal = new Vue({
    el: "#planUpdateModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "修改",
        plan: {
            id: 0,
            year: "",
            quantity: "",
        },
    },
    methods: {
        visible: function (plan) {
            this.plan.id = plan.id;
            this.plan.year = plan.year;
            this.plan.quantity = plan.quantity;
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        updatePlan: function () {
            if ("" === this.plan.quantity) {
                popoverSpace.append("请填写推免人数");
                return;
            }
            this.isDisabled = true;
            this.action = "正在修改";
            axios.put(requestContext + "api/plans", this.plan)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("修改成功", true);
                        window.location.reload();
                    } else {
                        popoverSpace.append("修改失败", false);
                    }
                    planUpdateModal.updateCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    planUpdateModal.updateCallback();
                });
        },
        updateCallback: function () {
            this.action = "修改";
            this.isDisabled = false;
        }
    }
});