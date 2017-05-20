const app = getApp();

Page({
    data: {
        display_2048: 'display-none'
    },
    onLoad: function() {
        this.setData({
            display_2048: app.isApproved ? '' : 'display-none'
        });
    },
    redirect2048: (e) => {
        wx.navigateTo({
            url: '../2048/2048'
        });
    },
    redirectAbout: (e) => {
        wx.navigateTo({
            url: '../about/about'
        });
    }
});
