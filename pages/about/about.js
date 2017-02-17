var util = require('../../util/util.js');

Page({
    data: {
        userInfo: null,
        inputStyle: '',
        emptyHidden: true,
        invalidHidden: true,
        successHidden: true
    },
    getUserInfo: function() {
        const that = this;
        wx.login({
            success: function() {
                wx.getUserInfo({
                    success: function(res) {
                        var userInfo = res.userInfo;
                        console.log(userInfo);
                        that.setData({
                            userInfo: userInfo
                        });
                    }
                });
            }
        });
    },
    inputFocus: function(e) {
        this.setData({
            inputStyle: 'feedback-input-focus'
        });
        if (!this.data.userInfo) {
            this.getUserInfo();
        }
    },
    inputBlur: function(e) {
        this.setData({
            inputStyle: ''
        });
    },
    formSubmit: function(e) {
        const that = this;
        var feedback = e.detail.value.feedback;
        if (!feedback) {
            this.setData({
                emptyHidden: false
            });
            return;
        }
        if (feedback.length < 5) {
            this.setData({
                invalidHidden: false
            });
            return;
        }
        var nickname = this.data.userInfo.nickName;
        var gender = this.data.userInfo.gender;
        wx.request({
            url: util.postFeedback(),
            data: {
                nickname: nickname,
                gender: gender,
                content: feedback
            },
            method: 'POST',
            success: function(res) {
                if (res.data == 'success') {
                    that.setData({
                        successHidden: false
                    });
                }
            }
        });
    },
    toastChange: function() {
        this.setData({
            emptyHidden: true,
            invalidHidden: true,
            successHidden: true
        });
    }
})
