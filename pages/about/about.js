const app = getApp();

Page({
    data: {
        display_summary: 'display-none'
    },
    onLoad: function() {
        this.setData({
            display_summary: app.isApproved ? '' : 'display-none'
        });
    },
    copy: function(e) {
        let href = e.currentTarget.dataset.href;
        wx.setClipboardData({
            data: href,
            success: function() {
                wx.showToast({
                    title: '已复制到剪贴板',
                    duration: 1000
                });
            }
        });
    }
});
