var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var cheerio = require('cheerio');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var variables = require('../variables.js');

var db = new sqlite3.Database('feedback.sqlite3');

router.get('/acts', function(req, res, next) {
    var query = require('url').parse(req.url, true).query;
    var offset = query.offset;
    var order = query.order;
    var indexUrl = "http://tongqu.me/index.php/api/act/type?type=0&offset=" + offset + "&order=" + order;
    http.get(indexUrl, function(response) {
        var source = "";
        response.on('data', function(data) {
            source += data;
        });
        response.on('end', function() {
            source = JSON.parse(source);
            var actsList = [];
            var acts = source.result.acts;
            var actsLength = acts.length;
            for (i = 0; i < actsLength; i++) {
                var poster = acts[i].poster;
                var status = acts[i].time_status_str;
                var status_style = '';
                if (!poster) {
                    poster = "http://tongqu.me/images/act_default_poster/" + randomPoster() + ".jpg";
                }
                if (status == "人数已满") {
                    status_style = "act-status-full";
                }
                if (status == "未开始报名") {
                    status_style = "act-status-todo";
                }
                if (status == "报名已结束") {
                    status_style = "act-status-done";
                }
                var act = {
                    actid: acts[i].actid,
                    poster: poster,
                    name: acts[i].name,
                    status: status,
                    status_style: status_style,
                    time: acts[i].start_time.substr(5) + " ~ " + acts[i].end_time.substr(5),
                    location: acts[i].location,
                    source: acts[i].source,
                    views: acts[i].view_count,
                    members: acts[i].member_count
                };
                actsList.push(act);
            }
            res.send({
                actsList: actsList
            });
        });
    });
});

router.get('/act', function(req, res, next) {
    var query = require('url').parse(req.url, true).query;
    var id = query.id;
    var indexUrl = "http://tongqu.me/index.php/api/act/detail?id=" + id;
    http.get(indexUrl, function(response) {
        var source = "";
        response.on('data', function(data) {
            source += data;
        });
        response.on('end', function() {
            source = JSON.parse(source);

            var main_info = source.main_info;
            var poster = main_info.photolink;
            var status = main_info.time_status_str;
            var status_style = '';
            if (!poster) {
                poster = "http://tongqu.me/images/act_default_poster/" + randomPoster() + ".jpg";
            }
            if (status == "人数已满") {
                status_style = "act-status-full";
            }
            if (status == "未开始报名") {
                status_style = "act-status-todo";
            }
            if (status == "报名已结束") {
                status_style = "act-status-done";
            }

            var actContents = [];
            var $ = cheerio.load(source.body);

            if ($("p").length) {
                $("p").each(function() {
                    var text = $(this).text().trim();
                    var textIf = true;
                    if (!text) {
                        textIf = false;
                    }
                    var $img = $(this).children("img");
                    var imageIf = false;
                    var image = "";
                    var imageCenter = "";
                    if ($img.length !== 0) {
                        imageIf = true;
                        image = $img.attr("src");
                        imageCenter = "image-center";
                    }
                    var viewIf = true;
                    if (!(textIf || imageIf)) {
                        viewIf = false;
                    }
                    var actContent = {
                        viewIf: viewIf,
                        text: text,
                        textIf: textIf,
                        image: image,
                        imageIf: imageIf,
                        imageCenter: imageCenter
                    };
                    actContents.push(actContent);
                });
            } else {
                var actContent = {
                    viewIf: true,
                    text: $.text().trim(),
                    textIf: true,
                    image: "",
                    imageIf: false,
                    imageCenter: ""
                };
                actContents.push(actContent);
            }

            var actDetail = {
                poster: poster,
                name: main_info.name,
                status: status,
                status_style: status_style,
                time: main_info.start_time.substr(5) + " ~ " + main_info.end_time.substr(5),
                location: main_info.location,
                source: main_info.source,
                actContents: actContents
            };
            res.send(actDetail);
        });
    });
});

router.post('/feedback', function(req, res, next) {
    var nickname = req.body.nickname;
    var gender = req.body.gender;
    var content = req.body.content;
    if (gender == 1) {
        gender = "男";
    } else if (gender == 2) {
        gender = "女";
    } else {
        gender = "未知";
    }
    db.run("INSERT INTO feedback (time, nickname, gender, content) VALUES ($time, $nickname, $gender, $content)", {
        $time: moment().format('MM-DD HH:mm'),
        $nickname: nickname,
        $gender: gender,
        $content: content
    }, function(err) {
        var data = "success";
        if (err) {
            data = "fail";
        }
        res.send(data);
    });
});

router.get('/feedback' + variables.feedbackKey, function(req, res, next) {
    db.all("SELECT time, nickname, gender, content FROM feedback ORDER BY rowid DESC", function(err, data) {
        res.render('feedback', {
            feedbackList: data
        });
    });
});

function randomPoster() {
    var index = Math.round(Math.random() * 6);
    return variables.posterDefault[index];
}

module.exports = router;
