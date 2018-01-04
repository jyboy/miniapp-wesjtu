const app = getApp();

Page({
    data: {
        display_pow211: app.isApproved ? '' : 'display-none',
        curYear: (new Date()).getFullYear()
    },
    redirect: (e) => {
        let page = e.currentTarget.dataset.page;
        wx.navigateTo({
            url: `../${page}/${page}`
        });
    }
});
