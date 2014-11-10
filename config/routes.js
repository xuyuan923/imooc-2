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
    app.get('/logout',User.logout);
    app.get('/admin/userlist',User.list);
    //电影
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/new',Movie.new);
    app.get('/admin/update/:id',Movie.update);
    app.get('/admin/movie',Movie.save);
    app.get('/admin/list',Movie.list);
    app.post('/admin/list',Movie.del);
}
