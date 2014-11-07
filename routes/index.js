var express = require('express');
var router = express.Router();

//GET index page
//回调函数，注入request,response方法
router.get('/',function(req,res){
	res.render('index',{
		title: 'imooc首页'
	})
});

//detail page
router.get('/',function(req,res){
	res.render('detail',{
		title: 'imooc详情页'
	})
});

//admin page
router.get('/',function(req,res){
	res.render('admin',{
		title: 'imooc后台录入页'
	})
});

//list page
router.get('/',function(req,res){
	res.render('list',{
		title: 'imooc列表页'
	})
});

module.exports = router;