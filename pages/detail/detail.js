const util = require('../../util/util.js');

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
        images: [],
        hidden: true,
        id: 0
    },
    onLoad: function(options) {
        this.fetchData(options.id);
        this.setData({
            id: options.id
        });
    },
    fetchData: function(id) {
        this.setData({
            hidden: false
        });
        wx.request({
            url: util.getActByID(id),
            success: (res) => {
                let data = res.data;
                this.setData({
                    poster: data.poster,
                    name: data.name,
                    status: data.status,
                    status_style: data.status_style,
                    time: data.time,
                    location: data.location,
                    source: data.source,
                    actContents: data.actContents,
                    images: data.images,
                    hidden: true
                });
            }
        });
    },
    previewImg: function(e) {
        wx.previewImage({
            current: e.currentTarget.id,
            urls: this.data.images
        });
    },
    onShareAppMessage: () => {
        return {
            title: '同去 -「我交」',
            path: `/pages/detail/detail?id=${this.data.id}`
        }
    }
})
