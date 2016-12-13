var HOST_URL = 'http://127.0.0.1:3001/wesjtu';
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