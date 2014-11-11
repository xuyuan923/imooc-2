/**
 * 路由文件
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
module.exports = function(app){
    //预处理用户
    app.use(function(req,res,next){
        var _user = req.session.user;
        app.locals.user = _user;
        return next();
    })
    //首页
    app.get('/',Index.index);
    //用户
    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);
    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);
    app.get('/logout',User.logout);
    //判断登录是否中间件
    app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list);
    //电影
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
    app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.save);
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
    app.post('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);
}
