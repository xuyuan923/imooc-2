var mongoose = require('mongoose')
var Schema = mongoose.Schema;
//作为字段的类型，也为了关联文档的查询
var ObjectId = Schema.Types.ObjectId;
var CommentSchema = new mongoose.Schema({
    //mongoose populate方法,方便引用其他模型的字段，通过ObejectId找到关联的文档
    movie: {type:ObjectId,ref:'Movie'},
    from: {type:ObjectId,ref:'User'},
    to: {type:ObjectId,ref:'User'},
    reply: [{
       from: {type:ObjectId,ref:'User'},
       to: {type:ObjectId,ref:'User'},
        content: String
    }],
    content: String,
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

CommentSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next()
})


CommentSchema.statics = {
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

module.exports = CommentSchema;
