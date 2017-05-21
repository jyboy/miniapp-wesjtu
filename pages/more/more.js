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
    redirect: (e) => {
        let page = e.currentTarget.dataset.page;
        wx.navigateTo({
            url: `../${page}/${page}`
        });
    }
});
