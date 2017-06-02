const util = require('../../util/util.js');

Page({
    data: {
        score: 0,
        maxScore: 0,
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        direction: '',
        wordnumbers: [
            [{
                number: 0,
                word: '他'
            }, {
                number: 0,
                word: '他'
            }, {
                number: 2,
                word: '苟'
            }, {
                number: 2,
                word: '苟'
            }],
            [{
                number: 0,
                word: '他'
            }, {
                number: 2,
                word: '苟'
            }, {
                number: 4,
                word: '利'
            }, {
                number: 0,
                word: '他'
            }],
            [{
                number: 0,
                word: '他'
            }, {
                number: 4,
                word: '利'
            }, {
                number: 0,
                word: '他'
            }, {
                number: 0,
                word: '他'
            }],
            [{
                number: 0,
                word: '他'
            }, {
                number: 0,
                word: '他'
            }, {
                number: 0,
                word: '他'
            }, {
                number: 0,
                word: '他'
            }]
        ],
        failHidden: true,
        successHidden: true,
        btnLoading: false
    },
    onLoad: function() {
        let maxScore = wx.getStorageSync('maxScore');
        if (!maxScore) maxScore = 0;
        this.setData({
            maxScore: maxScore
        });
    },
    storeScore: function() {
        if (this.data.maxScore < this.data.score) {
            this.setData({
                maxScore: this.data.score
            });
            wx.setStorageSync('maxScore', this.data.maxScore);
        }
    },
    tapStart: function(e) {
        this.setData({
            startx: e.touches[0].pageX,
            starty: e.touches[0].pageY
        });
    },
    tapMove: function(e) {
        this.setData({
            endx: e.touches[0].pageX,
            endy: e.touches[0].pageY
        });
    },
    tapEnd: function(e) {
        if (e.target.id === 'btn') {
            this.previewShare();
        } else {
            let herizontal = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
            let vertical = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;
            if (Math.abs(herizontal) > 10 || Math.abs(vertical) > 10) {
                let direction = (Math.abs(herizontal) > Math.abs(vertical)) ? this.computeDir(1, herizontal) : this.computeDir(0, vertical);
                this.setData({
                    startx: 0,
                    starty: 0,
                    endx: 0,
                    endy: 0
                });
                this.mergeAll(direction) && this.randInsert();
            }
        }
    },
    computeDir: (herizontal, vertical) => {
        if (herizontal) return (vertical > 0) ? 'right' : 'left';
        return (vertical > 0) ? 'bottom' : 'top';
    },

    mergeAll: function(dir) {
        this.checkFail();
        switch (dir) {
            case 'left':
                return this.mergeleft();
            case 'right':
                return this.mergeright();
            case 'top':
                return this.mergetop();
            case 'bottom':
                return this.mergebottom();
            default: ;
        }
    },
    // 左划
    mergeleft: function() {
        let change = false;
        let arr = this.data.wordnumbers;

        for (let i = 0; i < 4; i++) {
            //merge first
            for (let j = 0; j < 3; j++) {
                if (arr[i][j].number === 0) continue;
                for (let k = 1; k < 4 - j; k++) {
                    if (arr[i][j].number !== 0 && arr[i][j + k].number !== 0) {
                        if (arr[i][j].number != arr[i][j + k].number) break; // 不相同则直接跳过
                        arr[i][j].number = arr[i][j].number * 2;
                        arr[i][j + k].number = 0;
                        change = true;
                        this.setData({
                            score: this.data.score + arr[i][j].number / 2
                        });
                        break;
                    }
                }
            }
            // movemove
            for (let j = 0; j < 3; j++) {
                if (arr[i][j].number === 0) {
                    for (let k = 1; k < 4 - j; k++) {
                        if (arr[i][j + k].number !== 0) {
                            arr[i][j].number = arr[i][j + k].number;
                            arr[i][j + k].number = 0;
                            change = true;
                            break;
                        }
                    }
                }
            }
        }
        this.setData({
            wordnumbers: this.number2word(arr)
        });
        this.checkSuccess();
        this.storeScore();
        return change;
    },
    // 右滑
    mergeright: function() {
        let change = false;
        let arr = this.data.wordnumbers;

        for (let i = 0; i < 4; i++) {
            //merge first
            for (let j = 3; j > 0; j--) {
                if (arr[i][j].number === 0) continue;
                for (let k = 1; k <= j; k++) {
                    if (arr[i][j].number !== 0 && arr[i][j - k].number !== 0) {
                        if (arr[i][j].number != arr[i][j - k].number) break;
                        arr[i][j].number = arr[i][j].number * 2;
                        arr[i][j - k].number = 0;
                        change = true;
                        this.setData({
                            score: this.data.score + arr[i][j].number / 2
                        });
                        break;
                    }
                }
            }
            // movemove
            for (let j = 3; j > 0; j--) {
                if (arr[i][j].number === 0) {
                    for (let k = 1; k <= j; k++) {
                        if (arr[i][j - k].number !== 0) {
                            arr[i][j].number = arr[i][j - k].number;
                            arr[i][j - k].number = 0;
                            change = true;
                            break;
                        }
                    }
                }
            }
        }
        this.setData({
            wordnumbers: this.number2word(arr)
        });
        this.checkSuccess();
        this.storeScore();
        return change;
    },
    // 下划
    mergebottom: function() {
        let change = false;
        let arr = this.data.wordnumbers;

        for (let i = 0; i < 4; i++) {
            //merge first
            for (let j = 3; j > 0; j--) {
                if (arr[j][i].number === 0) continue;
                for (let k = 1; k <= j; k++) {
                    if (arr[j][i].number !== 0 && arr[j - k][i].number !== 0) {
                        if (arr[j][i].number != arr[j - k][i].number) break;
                        arr[j][i].number = arr[j][i].number * 2;
                        arr[j - k][i].number = 0;
                        change = true;
                        this.setData({
                            score: this.data.score + arr[j][i].number / 2
                        });
                        break;
                    }
                }
            }
            // movemove
            for (let j = 3; j > 0; j--) {
                if (arr[j][i].number === 0) {
                    for (let k = 1; k <= j; k++) {
                        if (arr[j - k][i].number !== 0) {
                            arr[j][i].number = arr[j - k][i].number;
                            arr[j - k][i].number = 0;
                            change = true;
                            break;
                        }
                    }
                }
            }
        }
        this.setData({
            wordnumbers: this.number2word(arr)
        });
        this.checkSuccess();
        this.storeScore();
        return change;
    },
    // 上滑
    mergetop: function() {
        let change = false;
        let arr = this.data.wordnumbers;

        for (let i = 0; i < 4; i++) {
            //merge first
            for (let j = 0; j < 3; j++) {
                if (arr[j][i].number === 0) continue;
                for (let k = 1; k < 4 - j; k++) {
                    if (arr[j][i].number !== 0 && arr[j + k][i].number !== 0) {
                        if (arr[j][i].number != arr[j + k][i].number) break;
                        arr[j][i].number = arr[j][i].number * 2;
                        arr[j + k][i].number = 0;
                        change = true;
                        this.setData({
                            score: this.data.score + arr[j][i].number / 2
                        });
                        break;
                    }
                }
            }
            // movemove
            for (let j = 0; j < 3; j++) {
                if (arr[j][i].number === 0) {
                    for (let k = 1; k < 4 - j; k++) {
                        if (arr[j + k][i].number !== 0) {
                            arr[j][i].number = arr[j + k][i].number;
                            arr[j + k][i].number = 0;
                            change = true;
                            break;
                        }
                    }
                }
            }
        }
        this.setData({
            wordnumbers: this.number2word(arr)
        });
        this.checkSuccess();
        this.storeScore();
        return change;
    },
    number2word: (arr) => {
        let numbersArray = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
        let wordsArray = ['他', '苟', '利', '国', '家', '生', '死', '以', '岂', '因', '祸', '福', '避', '趋', '之'];
        let wordnumbers = arr;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let index = numbersArray.indexOf(wordnumbers[i][j].number);
                wordnumbers[i][j].word = wordsArray[index];
            }
        }
        return wordnumbers;
    },
    // 随机插入
    randInsert: function() {
        let arr = this.data.wordnumbers;
        // 随机2或4
        let num = Math.random() < 0.8 ? 2 : 4;
        // 计算随机位置
        let zeros = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j].number === 0) {
                    zeros.push([i, j]);
                }
            }
        }
        let position = zeros[Math.floor(Math.random() * zeros.length)];
        arr[position[0]][position[1]].number = num;
        this.setData({
            wordnumbers: this.number2word(arr)
        });
    },
    checkFail: function() {
        let arr = this.data.wordnumbers;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j].number === 0) return;
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (arr[i][j].number == arr[i + 1][j].number || arr[i][j].number == arr[i][j + 1].number) return;
            }
        }

        for (let j = 0; j < 3; j++) {
            if (arr[3][j].number == arr[3][j + 1].number) return;
            if (arr[j][3].number == arr[j + 1][3].number) return;
        }
        this.setData({
            failHidden: false
        });
    },
    checkSuccess: function() {
        let arr = this.data.wordnumbers;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j].number == 16384) {
                    this.setData({
                        successHidden: false
                    });
                    console.log('success');
                }
            }
        }
    },
    modalConfirm: function() {
        this.setData({
            score: 0,
            wordnumbers: [
                [{
                    number: 0,
                    word: '他'
                }, {
                    number: 0,
                    word: '他'
                }, {
                    number: 2,
                    word: '苟'
                }, {
                    number: 2,
                    word: '苟'
                }],
                [{
                    number: 0,
                    word: '他'
                }, {
                    number: 2,
                    word: '苟'
                }, {
                    number: 4,
                    word: '利'
                }, {
                    number: 0,
                    word: '他'
                }],
                [{
                    number: 0,
                    word: '他'
                }, {
                    number: 4,
                    word: '利'
                }, {
                    number: 0,
                    word: '他'
                }, {
                    number: 0,
                    word: '他'
                }],
                [{
                    number: 0,
                    word: '他'
                }, {
                    number: 0,
                    word: '他'
                }, {
                    number: 0,
                    word: '他'
                }, {
                    number: 0,
                    word: '他'
                }]
            ],
            failHidden: true,
            successHidden: true
        });
    },
    modalCancle: function() {
        this.setData({
            failHidden: true,
            successHidden: true
        });
    },
    previewShare: function() {
        let score = this.data.score;
        let maxScore = this.data.maxScore;
        let matrix = encodeURIComponent(JSON.stringify(this.data.wordnumbers));
        this.setData({
            btnLoading: true
        });
        wx.request({
            url: util.getShare(score, maxScore, matrix),
            success: (res) => {
                this.setData({
                    btnLoading: false
                });
                wx.previewImage({
                    urls: [`${util.HOST_URL}/share/${res.data.image}`]
                });
            }
        });
    },
    onShareAppMessage: () => {
        return {
            title: '2048 -「我交」',
            path: '/pages/pow211/pow211'
        }
    }
});
