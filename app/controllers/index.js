/**
 * 首页路由模块
 */
var Movie = require('../models/movie');
var Category = require('../models/category');
exports.index = function(req,res){
    Category
        .find({})
        .populate({path:'movies',options:{limit:5}})
        .exec(function(err,categories){
            if (err) {
                console.log(err)
            }
            res.render('index', {
                title: '影院热度播报',
                categories: categories
            })
        })

}
