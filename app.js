const util = require('./util/util.js');

App({
    isApproved: false,
    onLaunch: function() {
        let that = this;
        wx.request({
            url: util.getSignal(),
            success: (res) => {
                if (parseInt(res.statusCode) === 200) {
                    that.isApproved = res.data.isApproved;
                } else {
                    that.isApproved = false;
                }
            },
            fail: () => {
                that.isApproved = false;
            }
        });
    }
});
