var mongoose = require('mongoose');
//密码加密工具
var bcrypt = require('bcrypt');
var SALT_WORK_FACTORY = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    //0: 普通
    //1: 认证用户
    //2: 高级用户
    //>10: 管理员
    //>50: 超级管理员
    role: {
        type: Number,
        default: 0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})


UserSchema.pre('save',function(next){
    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTORY,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err);
            user.password = hash;
            next();
        })
    });
    //next();
})


//实例方法，从实例里调
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    }
}

//静态方法，从模型里来调
UserSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}

module.exports = UserSchema;
