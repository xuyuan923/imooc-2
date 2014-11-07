var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
var bodyParser = require('body-parser');
var _ = require('underscore');
var port = process.env.PORT || 8000;
var app = express();
mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);
console.log('imooc started on port ' + port);

//首页
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: '影院热度播报',
            movies: movies
        })
    })
});

//注册
app.post('/user/signup',function(req,res){
    var _user = req.body.user;
    //注意这里是findOne,不是find(),findOne()查找最近的一条数据
    User.findOne({name:_user.name},function(err,user){
        if(err) console.log(err);
        if(user){
            return res.redirect('/');
            //res.send('username exist');
        }
        else{
            var user = new User(_user);
            user.save(function(err,user){
                if(err) console.log(err);
                res.redirect('/admin/userlist');
            })
        }
    })
});

app.get('/admin/userlist',function(req,res){
    User.fetch(function(err,users){
        if(err) console.log(err);
        res.render('userlist',{
            title: 'imooc 用户列表页',
            users: users
        })
    })
})


app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        })
    })
});

app.get('/admin/movie', function (req, res) {
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
});

app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页面',
                movie: movie
            })
        })
    }
});

// admin post movie
app.post('/admin/movie/new', function (req, res) {
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
});

app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
});

//list delete movie
//express方法里有app.delete方法？
app.post('/admin/list',function(req,res){
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
});





