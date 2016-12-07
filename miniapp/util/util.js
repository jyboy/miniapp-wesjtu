var HOST_URL = 'https://www.qingniao.tech/wesjtu';
var GET_ACTS = '/acts';
var GET_ACT_BY_ID = '/act';
var POST_FEEDBACK = '/feedback';

module.exports = {
    getActs: function (obj) {
        return HOST_URL + GET_ACTS + '?offset=' + obj.offset + '&order=' + obj.order;
    },
    getActByID: function (id) {
        return HOST_URL + GET_ACT_BY_ID + '?id=' + id;
    },
    postFeedback: function () {
        return HOST_URL + POST_FEEDBACK;
    }
};