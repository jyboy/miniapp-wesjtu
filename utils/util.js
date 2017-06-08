const HOST_URL = 'https://api.atsjtu.cc/wesjtu';
const GET_SIGNAL = '/getSignal'
const GET_ACTS = '/acts';
const GET_ACT_BY_ID = '/act';
const GET_SHARE = '/getShare';

module.exports = {
    HOST_URL: HOST_URL,
    getSignal: () => {
        return HOST_URL + GET_SIGNAL;
    },
    getActs: (obj) => {
        return HOST_URL + GET_ACTS + '?offset=' + obj.offset + '&order=' + obj.order;
    },
    getActByID: (id) => {
        return HOST_URL + GET_ACT_BY_ID + '?id=' + id;
    },
    getShare: (score, maxScore, matrix) => {
        return HOST_URL + GET_SHARE + '?type=' + type + '&score=' + score + '&maxScore=' + maxScore + '&matrix=' + matrix;
    }
};