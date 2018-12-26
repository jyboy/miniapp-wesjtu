const util = require('../../utils/util');

Page({
    data: {
        hot: '',
        new: 'top-bar-item-active',
        actsList: [],
        offset: 0,
        order: 'act.create_time',
        moreHidden: true
    },
    onLoad: function (opts) {
        if (opts.order === '') {
            this.onTapHot();
        } else {
            this.onTapNew();
        }
    },
    onTapNew: function() {
        this.setData({
            hot: '',
            new: 'top-bar-item-active',
            offset: 0,
            order: 'act.create_time'
        });
        this.fetchData({
            order: this.data.order
        });
    },
    onTapHot: function () {
        this.setData({
            hot: 'top-bar-item-active',
            new: '',
            offset: 0,
            order: ''
        });
        this.fetchData({
            order: this.data.order
        });
    },
    fetchData: function (data) {
        this.setData({
            moreHidden: false
        });
        if (!data.offset) {
            data.offset = 0;
            this.setData({
                actsList: []
            });
        }
        wx.request({
            url: util.getActs(data),
            success: (res) => {
                this.setData({
                    actsList: this.data.actsList.concat(res.data.actsList),
                    moreHidden: true
                });
            }
        });
    },
    navigateDetail: (e) => {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        });
    },
    lower: function (e) {
        this.setData({
            offset: this.data.offset + 10
        });
        this.fetchData({
            offset: this.data.offset,
            order: this.data.order
        });
    },
    onShareAppMessage: function () {
        return {
            title: '同去 -「我交」',
            path: `/pages/tongqu/tongqu?order=${this.data.order}`
        };
    }
});
