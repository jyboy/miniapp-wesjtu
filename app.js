const util = require('./utils/util');

App({
    isApproved: false,
    onLaunch: function() {
        wx.request({
            url: util.getSignal(),
            success: (res) => {
                if (parseInt(res.statusCode) === 200) {
                    this.isApproved = res.data.isApproved;
                } else {
                    this.isApproved = false;
                }
            },
            fail: () => {
                this.isApproved = false;
            }
        });
    }
})
