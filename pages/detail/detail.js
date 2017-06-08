const app = getApp();
const util = require('../../utils/util');

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
        id: 0,
        regArr: [],
        regIncludes: false,
        display_register: true
    },
    onLoad: function(options) {
        this.fetchData(options.id);
        this.setData({
            id: options.id,
            display_register: app.isApproved ? 'display-none' : ''
        });
        let regArr = wx.getStorageSync('regArr');
        if (regArr) {
            this.setData({
                regIncludes: regArr.includes(options.id),
                regArr: regArr.split(',')
            });
        }
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
    register: function() {
        let regArr = this.data.regArr;
        if (this.data.regIncludes) {
            regArr.splice(regArr.indexOf(this.data.id), 1);
        } else {
            regArr.push(this.data.id);
        }
        this.setData({
            regIncludes: !this.data.regIncludes,
            regArr: regArr
        });
        wx.setStorage({
            key: 'regArr',
            data: regArr.join(),
            success: () => {
                wx.showToast({
                    title: this.data.regIncludes ? '预约成功' : '取消预约成功',
                    duration: 1000
                });
            }
        });
    },
    onShareAppMessage: () => {
        return {
            title: '同去 -「我交」',
            path: `/pages/detail/detail?id=${this.data.id}`
        }
    }
})
