const app = getApp();

Page({
    data: {
        display_summary: 'display-none',
        wechatUrl: 'http://okoz2doi2.bkt.clouddn.com/images/qrcode_wechat.jpg'
    },
    onLoad: function () {
        this.setData({
            display_summary: app.isApproved ? '' : 'display-none'
        });
    },
    copy: (e) => {
        wx.setClipboardData({
            data: e.currentTarget.dataset.href,
            success: () => {
                wx.showToast({
                    title: '已复制到剪贴板',
                    duration: 1000
                });
            },
        });
    },
    previewWechat: function() {
        wx.previewImage({
            urls: [this.data.wechatUrl]
        });
    }
});
