const container = new Vue({
    el: "#container",
    data: {
        tabIndex: 1,
        isDisabled: false,
        action: "保存",
        plan: {},
        student: {},
    },
    methods: {
        setPlan: function (plan) {
            this.plan = plan;
            if (plan.status >= 2 && plan.status < 3) {
                this.tabIndex = 2;
            } else if (plan.status >= 3 && plan.status < 4) {
                this.tabIndex = 3;
            } else if (plan.status >= 4) {
                this.tabIndex = 4;
            }
        },
        setStudent: function (student) {
            this.student = student;
        },
        changeTab: function (index) {
            this.tabIndex = index;
        },
        changeExamScore: function () {
            this.student.examScore = 0;
            if ("" !== this.student.averageScore && null !== this.student.averageScore) {
                this.student.examScore += parseInt(this.student.averageScore);
            }
            if ("" !== this.student.proCourseScore && null !== this.student.proCourseScore) {
                this.student.examScore += parseInt(this.student.proCourseScore);
            }
            if ("" !== this.student.englishScore && null !== this.student.englishScore) {
                this.student.examScore += parseInt(this.student.englishScore);
            }
            if ("" !== this.student.additionalScore && null !== this.student.additionalScore) {
                this.student.examScore += parseInt(this.student.additionalScore);
            }
        },
        saveCourseList: function () {
            for (let index = 0; index < this.student.courseList.length; index++) {
                if ("" === this.student.courseList[index].score) {
                    popoverSpace.append("请填写成绩", false);
                    return;
                }
            }
            this.isDisabled = true;
            this.action = "正在保存";
            axios.put(requestContext + "api/courses", this.student.courseList)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("保存成功", true);
                    } else {
                        popoverSpace.append("保存失败", false);
                    }
                    container.saveCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    container.saveCallback();
                });
        },
        saveExamScore: function () {
            if (null == this.student.proCourseScore || "" === this.student.proCourseScore) {
                popoverSpace.append("请填写专业课成绩", false);
                return;
            }
            if (null == this.student.englishScore || "" === this.student.englishScore) {
                popoverSpace.append("请填写英语成绩", false);
                return;
            }
            if (null == this.student.additionalScore || "" === this.student.additionalScore) {
                popoverSpace.append("请填写附加分", false);
                return;
            }
            this.isDisabled = true;
            this.action = "正在保存";
            this.changeExamScore();
            axios.put(requestContext + "api/students", this.student)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("保存成功", true);
                    } else {
                        popoverSpace.append("保存失败", false);
                    }
                    container.saveCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    container.saveCallback();
                });
        },
        saveInterviewScore: function () {
            if (null == this.student.interviewScore || "" === this.student.interviewScore) {
                popoverSpace.append("请填写面试成绩", false);
                return;
            }
            this.isDisabled = true;
            this.action = "正在保存";
            axios.put(requestContext + "api/students", this.student)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("保存成功", true);
                    } else {
                        popoverSpace.append("保存失败", false);
                    }
                    container.saveCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    container.saveCallback();
                });
        },
        saveCallback: function () {
            this.action = "保存";
            this.isDisabled = false;
        }
    },
    mounted: function () {
        let url = window.location;
        let id = getUrlParam(url, "student");
        axios.get(requestContext + "api/students/" + id)
            .then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    container.setPlan(response.data.data.plan);
                    container.setStudent(response.data.data.student);
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