const container = new Vue({
    el: "#container",
    data: {
        year: "",
        status: 0,
        plan: {},
        studentList: []
    },
    methods: {
        setPlan: function (plan) {
            this.plan = plan;
            if (plan.status < 3) {
                this.status = 0;
            } else if (plan.status >= 3 && plan.status < 4) {
                this.status = 1;
            } else if (plan.status >= 4) {
                this.status = 2;
            }
        },
        getPlan: function () {
            return this.plan;
        },
        getYear: function () {
            return this.year;
        },
        setStudentList: function (studentList) {
            this.studentList = studentList;
        },
        scoreImportModalVisible: function () {
            scoreImportModal.visible();
        },
        inspectionSubmitModalVisible: function () {
            inspectionSubmitModal.visible();
        },
        examSubmitModalVisible: function () {
            examSubmitModal.visible();
        },
        interviewSubmitModalVisible: function () {
            interviewSubmitModal.visible();
        },
        planCompleteModalVisible: function () {
            planCompleteModal.visible();
        },
        studentDeleteModalVisible: function (student, index) {
            studentDeleteModal.visible(student, index);
        },
        queryStudentList: function () {
            axios.get(requestContext + "api/students?year=" + this.year + "&status=" + this.status)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        container.setStudentList(response.data.data.studentList);
                    } else {
                        popoverSpace.append("数据获取失败", false);
                    }
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                })
        },
        deleteStudent: function (index) {
            this.studentList.splice(index, 1);
        }
    },
    mounted: function () {
        let url = window.location;
        this.year = getUrlParam(url, "year");
        axios.get(requestContext + "api/students?year=" + this.year)
            .then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    container.setPlan(response.data.data.plan);
                    container.setStudentList(response.data.data.studentList);
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

const scoreImportModal = new Vue({
    el: "#scoreImportModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "导入",
    },
    methods: {
        visible: function () {
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        importScoreFile: function () {
            let file = document.getElementById("file").files[0];
            if (!file) {
                popoverSpace.append("请选择文件", false);
                return;
            }
            this.isDisabled = true;
            this.action = "正在导入";
            let param = new FormData();  // 创建Form对象
            // 通过append向Form对象添加数据
            param.append("year", container.getYear());
            param.append("file", file, file.name);
            let config = {
                headers: {"Content-Type": "multipart/form-data"}
            };  // 添加请求头
            axios.post(requestContext + "api/students/import", param, config)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("导入成功", true);
                        window.location.reload();
                    } else {
                        popoverSpace.append("导入失败", false);
                    }
                    scoreImportModal.importCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    scoreImportModal.importCallback();
                });
        },
        importCallback: function () {
            this.action = "导入";
            this.isDisabled = false;
        }
    }
});

const inspectionSubmitModal = new Vue({
    el: "#inspectionSubmitModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "提交",
    },
    methods: {
        visible: function () {
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        submitInspection: function () {
            this.isDisabled = true;
            this.action = "正在提交";
            axios.put(requestContext + "api/plans", {
                id: container.getPlan().id,
                year: container.getPlan().year,
                quantity: container.getPlan().quantity,
                inspection: 2,
                exam: 1
            }).then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    popoverSpace.append("提交成功", true);
                    window.location.reload();
                } else {
                    let message = getMessage(statusCode);
                    popoverSpace.append(message, false);
                }
                inspectionSubmitModal.submitCallback();
            }).catch(function () {
                popoverSpace.append("服务器访问失败", false);
                inspectionSubmitModal.submitCallback();
            });
        },
        submitCallback: function () {
            this.action = "提交";
            this.isDisabled = false;
        }
    }
});

const examSubmitModal = new Vue({
    el: "#examSubmitModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "提交",
    },
    methods: {
        visible: function () {
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        submitExam: function () {
            this.isDisabled = true;
            this.action = "正在提交";
            axios.put(requestContext + "api/plans", {
                id: container.getPlan().id,
                year: container.getPlan().year,
                exam: 2,
                interview: 1
            }).then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    popoverSpace.append("提交成功", true);
                    window.location.reload();
                } else {
                    let message = getMessage(statusCode);
                    popoverSpace.append(message, false);
                }
                examSubmitModal.submitCallback();
            }).catch(function () {
                popoverSpace.append("服务器访问失败", false);
                examSubmitModal.submitCallback();
            });
        },
        submitCallback: function () {
            this.action = "提交";
            this.isDisabled = false;
        }
    }
});

const interviewSubmitModal = new Vue({
    el: "#interviewSubmitModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "提交",
    },
    methods: {
        visible: function () {
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        submitInterview: function () {
            this.isDisabled = true;
            this.action = "正在提交";
            axios.put(requestContext + "api/plans", {
                id: container.getPlan().id,
                year: container.getPlan().year,
                quantity: container.getPlan().quantity,
                interview: 2,
                admission: 1
            }).then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    popoverSpace.append("提交成功", true);
                    window.location.reload();
                } else {
                    let message = getMessage(statusCode);
                    popoverSpace.append(message, false);
                }
                interviewSubmitModal.submitCallback();
            }).catch(function () {
                popoverSpace.append("服务器访问失败", false);
                interviewSubmitModal.submitCallback();
            });
        },
        submitCallback: function () {
            this.action = "提交";
            this.isDisabled = false;
        }
    }
});

const planCompleteModal = new Vue({
    el: "#planCompleteModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "确认",
    },
    methods: {
        visible: function () {
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        completePlan: function () {
            this.isDisabled = true;
            this.action = "正在提交";
            axios.put(requestContext + "api/plans", {
                id: container.getPlan().id,
                year: container.getPlan().year,
                admission: 2
            }).then(function (response) {
                let statusCode = response.data.statusCode;
                if (200 === statusCode) {
                    popoverSpace.append("完成推免计划", true);
                    window.location.reload();
                } else {
                    popoverSpace.append("提交失败", false);
                }
                planCompleteModal.completeCallback();
            }).catch(function () {
                popoverSpace.append("服务器访问失败", false);
                planCompleteModal.completeCallback();
            });
        },
        completeCallback: function () {
            this.action = "确认";
            this.isDisabled = false;
        }
    }
});

const studentDeleteModal = new Vue({
    el: "#studentDeleteModal",
    data: {
        isVisible: false,
        isDisabled: false,
        action: "确认",
        student: {},
        index: 0
    },
    methods: {
        visible: function (student, index) {
            this.student = student;
            this.index = index;
            this.isVisible = true;
        },
        invisible: function () {
            this.isVisible = false;
        },
        deleteStudent: function () {
            this.isDisabled = true;
            this.action = "正在删除";
            axios.delete(requestContext + "api/students/" + this.student.id)
                .then(function (response) {
                    let statusCode = response.data.statusCode;
                    if (200 === statusCode) {
                        popoverSpace.append("删除成功", true);
                        container.deleteStudent(studentDeleteModal.index);
                        studentDeleteModal.invisible();
                    } else {
                        popoverSpace.append("删除失败", false);
                    }
                    studentDeleteModal.deleteCallback();
                })
                .catch(function () {
                    popoverSpace.append("服务器访问失败", false);
                    studentDeleteModal.deleteCallback();
                });
        },
        deleteCallback: function () {
            this.action = "确认";
            this.isDisabled = false;
        }
    }
});