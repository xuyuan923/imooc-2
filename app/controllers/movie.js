/**
 * 电影列表
 */
var mongoose = require('mongoose');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');
//电影详情页
exports.detail = function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        //callback方式处理
        //查询comment哪些movie的id和详情页的movie是同一个
        Comment
            .find({movie:id})
            //找到from里的ObjectId,去User表里查
            .populate('from','name')
            .populate('reply.from reply.to','name')
            .exec(function(err,comments){
                //comments是个数组
                console.log('comments:');
                console.log(comments);
                res.render('detail', {
                    title: 'imooc 详情页',
                    movie: movie,
                    comments: comments
                })
        })
    })
};

//电影后台录入
exports.new = function (req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页面',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
};

//电影更新
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页面',
                movie: movie
            })
        })
    }
};

// admin post movie
exports.save = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + _movie.id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        });

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + _movie.id)
        })
    }
};

//电影列表页
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
};

//删除电影
//所有put/delete方法都可以使用post方法
exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id: id},function(err,movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
};