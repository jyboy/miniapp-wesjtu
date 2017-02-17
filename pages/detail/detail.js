var util = require('../../util/util.js');

Page({
    data: {
        poster: '',
        name: '',
        status: '',
        status_style: '',
        time: '',
        location: '',
        source: '',
        actContents: [],
        hidden: true
    },
    onLoad: function(options) {
        this.fetchData(options.id);
    },
    fetchData: function(id) {
        const that = this;
        this.setData({
            hidden: false
        });
        wx.request({
            url: util.getActByID(id),
            success: function(res) {
                var data = res.data;
                that.setData({
                    poster: data.poster,
                    name: data.name,
                    status: data.status,
                    status_style: data.status_style,
                    time: data.time,
                    location: data.location,
                    source: data.source,
                    actContents: data.actContents,
                    hidden: true
                });
            }
        });
    }
})
