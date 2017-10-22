const app = getApp();

Page({
    data: {
        display_pow211: 'display-none',
        current: (new Date()).getFullYear()
    },
    onLoad: function() {
        this.setData({
            display_pow211: app.isApproved ? '' : 'display-none'
        });
    },
    redirect: (e) => {
        let page = e.currentTarget.dataset.page;
        wx.navigateTo({
            url: `../${page}/${page}`
        });
    }
});
