var app = getApp();

Page({
    data: {
        accessKey: '',
        accessHidden: true,
        accessArray: ['他', '苟', '吼', '蛤', '膜'],
        score: 0,
        maxscore: 0,
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
        successHidden: true
    },
    onLoad: function() {
        // 调用API从本地缓存中获取数据
        var accessKey = wx.getStorageSync('accessKey');
        if (!accessKey) accessKey = '';
        this.setData({
            accessKey: accessKey
        });
        if (!this.data.accessKey) {
            this.setData({
                accessHidden: false
            });
        }
        var maxscore = wx.getStorageSync('maxscore');
        if (!maxscore) maxscore = 0;
        this.setData({
            maxscore: maxscore
        });
    },
    inputFocus: function(e) {
        this.setData({
            inputStyle: 'access-input-focus'
        });
    },
    inputBlur: function(e) {
        this.setData({
            accessKey: e.detail.value,
            inputStyle: ''
        });
    },
    accessConfirm: function() {
        if (this.data.accessArray.indexOf(this.data.accessKey) == '-1') {
            this.setData({
                inputStyle: 'access-input-warn'
            });
        } else {
            this.setData({
                accessHidden: true
            });
            wx.setStorageSync('accessKey', this.data.accessKey);
        }
    },
    storeScore: function() {
        if (this.data.maxscore < this.data.score) {
            this.setData({
                maxscore: this.data.score
            });
            wx.setStorageSync('maxscore', this.data.maxscore);
        }
    },
    tapStart: function(event) {
        this.setData({
            startx: event.touches[0].pageX,
            starty: event.touches[0].pageY
        });
    },
    tapMove: function(event) {
        this.setData({
            endx: event.touches[0].pageX,
            endy: event.touches[0].pageY
        });
    },
    tapEnd: function(event) {
        var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
        var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;
        if (Math.abs(heng) > 5 || Math.abs(shu) > 5) {
            var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng) : this.computeDir(0, shu);
            this.setData({
                startx: 0,
                starty: 0,
                endx: 0,
                endy: 0
            });
            this.mergeAll(direction) && this.randInsert();
        }
    },
    computeDir: function(heng, num) {
        if (heng) return (num > 0) ? 'right' : 'left';
        return (num > 0) ? 'bottom' : 'top';
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
            default:
        }
    },
    // 左划
    mergeleft: function() {
        var change = false;
        var arr = this.data.wordnumbers;

        for (var i = 0; i < 4; i++) {
            //merge first
            for (var j = 0; j < 3; j++) {
                if (arr[i][j].number === 0) continue;
                for (var k = 1; k < 4 - j; k++) {
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
            for (var j = 0; j < 3; j++) {
                if (arr[i][j].number === 0) {
                    for (var k = 1; k < 4 - j; k++) {
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
        var change = false;
        var arr = this.data.wordnumbers;

        for (var i = 0; i < 4; i++) {
            //merge first
            for (var j = 3; j > 0; j--) {
                if (arr[i][j].number === 0) continue;
                for (var k = 1; k <= j; k++) {
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
            for (var j = 3; j > 0; j--) {
                if (arr[i][j].number === 0) {
                    for (var k = 1; k <= j; k++) {
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
        var change = false;
        var arr = this.data.wordnumbers;

        for (var i = 0; i < 4; i++) {
            //merge first
            for (var j = 3; j > 0; j--) {
                if (arr[j][i].number === 0) continue;
                for (var k = 1; k <= j; k++) {
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
            for (var j = 3; j > 0; j--) {
                if (arr[j][i].number === 0) {
                    for (var k = 1; k <= j; k++) {
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
        var change = false;
        var arr = this.data.wordnumbers;

        for (var i = 0; i < 4; i++) {
            //merge first
            for (var j = 0; j < 3; j++) {
                if (arr[j][i].number === 0) continue;
                for (var k = 1; k < 4 - j; k++) {
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
            for (var j = 0; j < 3; j++) {
                if (arr[j][i].number === 0) {
                    for (var k = 1; k < 4 - j; k++) {
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
    number2word: function(arr) {
        var numbersArray = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
        var wordsArray = ['他', '苟', '利', '国', '家', '生', '死', '以', '岂', '因', '祸', '福', '避', '趋', '之'];
        var wordnumbers = arr;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var index = numbersArray.indexOf(wordnumbers[i][j].number);
                wordnumbers[i][j].word = wordsArray[index];
            }
        }
        return wordnumbers;
    },
    // 随机插入
    randInsert: function() {
        var arr = this.data.wordnumbers;
        // 随机2或4
        var num = Math.random() < 0.8 ? 2 : 4;
        // 计算随机位置
        var zeros = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (arr[i][j].number === 0) {
                    zeros.push([i, j]);
                }
            }
        }
        var position = zeros[Math.floor(Math.random() * zeros.length)];
        arr[position[0]][position[1]].number = num;
        this.setData({
            wordnumbers: this.number2word(arr)
        });
    },
    checkFail: function() {
        var arr = this.data.wordnumbers;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (arr[i][j].number === 0) return;
            }
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (arr[i][j].number == arr[i + 1][j].number || arr[i][j].number == arr[i][j + 1].number) return;
            }
        }

        for (var j = 0; j < 3; j++) {
            if (arr[3][j].number == arr[3][j + 1].number) return;
            if (arr[j][3].number == arr[j + 1][3].number) return;
        }
        this.setData({
            failHidden: false
        });
    },
    checkSuccess: function() {
        var arr = this.data.wordnumbers;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
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
});
