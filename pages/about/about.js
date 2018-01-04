const app = getApp();

Page({
    data: {
        display_summary: app.isApproved ? '' : 'display-none',
        wechat_url: 'http://okoz2doi2.bkt.clouddn.com/image/qrcode_wechat.jpg'
    },
    previewWechat: function() {
        wx.previewImage({
            urls: [this.data.wechat_url]
        });
    }
});
