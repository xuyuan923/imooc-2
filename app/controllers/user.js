/**
 * 用户注册登录模块
 */
var User = require('../models/user');
//注册
exports.signup = function(req,res){
    var _user = req.body.user;
    //注意这里是findOne,不是find(),findOne()查找最近的一条数据
    User.findOne({name:_user.name},function(err,user){
        if(err) console.log(err);
        if(user){
            return res.redirect('/');
        }
        else{
            var user = new User(_user);
            user.save(function(err,user){
                if(err) console.log(err);
                res.redirect('/admin/userlist');
            })
        }
    })
};

//登陆
exports.signin = function(req,res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name:name},function(err,user){
        if(err) console.log(err);
        if(!user) return res.redirect('/');
        //调用实例方法
        user.comparePassword(password,function(err,isMatch){
            if(err) console.log(err);
            if(isMatch) {
                console.log('password match');
                req.session.user = user;
                return res.redirect('/');
            }else{
                console.log('password err');
            }
        })
    })
};

//登出
exports.logout = function(req,res){
    delete req.session.user;
    //delete app.locals.user;;
    res.redirect('/');
};

//获取用户列表
exports.list = function(req,res){
    User.fetch(function(err,users){
        if(err) console.log(err);
        res.render('userlist',{
            title: 'imooc 用户列表页',
            users: users
        })
    })
};
