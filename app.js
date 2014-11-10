var express = require('express');
var path = require('path');
var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var cookieParser = require('cookie-parser'); //session需要cookie-parser中间件
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var logger = require('morgan'); //在vim里打印开发环境日志
var port = process.env.PORT || 8000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(cookieParser());
//session中配置secret
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

//判断线上环境和开发环境是否一致,打印数据库操作日志
if("development" === app.get("env")){
    app.set("showStackError",true);
    app.use(logger(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set("debug",true);
}
require('./config/routes')(app);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);
console.log('imooc started on port ' + port);







