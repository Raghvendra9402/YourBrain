import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    },
    username : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const Tag = new Schema({
    title : {
        type : String,
        required : true,
        unique : true
    }
});
const contentTypes = ["image","video","article","audio"];
const Content = new Schema({
    link : {
        type : String,
        required : true
    },
    type : {
        type : String,
        enum : contentTypes,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    tags : [{
        type : mongoose.Types.ObjectId,
        ref : "tags"
    }],
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "users"
    }
});
const LinkSchema = new Schema({
    hash : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "users"
    }
})

const UserModel = mongoose.model("users", User);
const TagModel = mongoose.model("tags",Tag);
const ContentModel = mongoose.model("contents", Content);
const LinkModel = mongoose.model("links", LinkSchema);

export default {UserModel,TagModel,ContentModel,LinkModel};
