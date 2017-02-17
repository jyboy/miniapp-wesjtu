var util = require('../../util/util.js');

Page({
    data: {
        hot: 'top-bar-item-active',
        new: '',
        actsList: [],
        offset: 0,
        order: '',
        moreHidden: true
    },
    onLoad: function() {
        this.fetchData({
            order: ''
        });
    },
    onTapTag: function(e) {
        if (e.currentTarget.id == 'hot') {
            this.setData({
                hot: 'top-bar-item-active',
                new: '',
                offset: 0,
                order: ''
            });
        } else {
            this.setData({
                hot: '',
                new: 'top-bar-item-active',
                offset: 0,
                order: 'act.create_time'
            });
        }
        this.fetchData({
            order: this.data.order
        });
    },
    fetchData: function(data) {
        const that = this;
        this.setData({
            moreHidden: false
        });
        if (!data.offset) {
            data.offset = 0;
        }
        if (data.offset === 0) {
            this.setData({
                actsList: []
            });
        }
        wx.request({
            url: util.getActs(data),
            success: function(res) {
                that.setData({
                    actsList: that.data.actsList.concat(res.data.actsList),
                    moreHidden: true
                });
            }
        });
    },
    redictDetail: function(e) {
        var id = e.currentTarget.id,
            url = '../detail/detail?id=' + id;
        wx.navigateTo({
            url: url
        });
    },
    lower: function(e) {
        this.setData({
            offset: this.data.offset + 10
        });
        this.fetchData({
            offset: this.data.offset,
            order: this.data.order
        });
    }
})
